/*
Copyright
*/

/**
 * простой Service Worker для демонстрации работы PWA приложения
 * используется стратегия Network First (Network Falling Back to Cache)
 * все запросы отправляются в сеть,
 * если сеть недоступна извлекаются из кеша,
 * если в кеше данных нет используются данные-заглушки
 */

/**
 * Url ресурса для получения тестовых данных
 * @type {string}
 */
const apiUrl = 'https://jsonplaceholder.typicode.com';

/**
 * Файлы, которые мы планируем сохранять в кеше для оффлайн режима
 * @type {string[]}
 */
const files = [
    './',
    './app.js',
    './style.css',
    './fallback/posts.json',
    './fallback/users.json',
];

/**
 * Ловим событие "install", установка нашего приложения при первой загрузке
 */
self.addEventListener('install', async e => {
    // получаем ссылку на кеш
    const cache = await caches.open('files');
    // сохраняем в кеше файлы приложения и заглушки для данных
    cache.addAll(files);
});

/**
 * проверка, что url запроса является url нашего api
 * @param req
 * @returns {boolean}
 */
function isApiCall(req) {
    return req.url.startsWith(apiUrl);
}

/**
 * получаем результаты запроса из кеша
 * @param req
 * @returns {Promise<*>}
 */
async function getFromCache(req) {
    // запрос в кеш
    const res = await caches.match(req);
    
    if (!res) {
        // в кеше нет данных для запроса
        // отправляем запрос в сеть
        // return fetch(req);
        return getFromNetwork(req)
    }
    
    return res;
}

/**
 * сеть недоступна и в кеше нет результатов запроса
 * возвращаем данные-заглушки
 * @param req
 * @returns {Promise<any>}
 */
async function getFallback(req) {
    const path = req.url.substr(apiUrl.length);
    
    if (path.startsWith('/posts')) {
        return caches.match('./fallback/posts.json');
    } else if (path.startsWith('/users')) {
        return caches.match('./fallback/users.json');
    }
}

/**
 * выполняем сетевой запрос
 * сохраняем результат в кеш
 * @param req
 * @returns {Promise<*>}
 */
async function getFromNetwork(req) {
    // ссылка не кеш с тэгом "data"
    const cache = await caches.open('data');
    
    try {
        // выполняем запрос в сеть
        const res = await fetch(req);
        // сохраняем результат в кеш
        cache.put(req, res.clone());
        return res;
    } catch (e) {
        // уупс, что-то пошло не так, сеть не работает!!!
        // извлекаем результат запроса из кеша
        const res = await cache.match(req);
        // возвращаем результат запроса если он найден в кеше
        // возвращаем данные-заглушки если в кеше нет результатов запроса
        return res || getFallback(req);
    }
}

/**
 * перехватываем событие обозревателя "fetch" - запрос в сеть
 */
self.addEventListener('fetch', async e => {
    // извлекаем запрос из события
    const req = e.request;
    // запрос соответствует нашему api url - обращаемся в сеть
    // прочие запросы (html, css, js, json и любые другие файлы) - пытаемся получить результаты из кеша
    // эти файлы являются частями нашего приложения и сохраняются при первой загрузке
    const res = isApiCall(req) ? getFromNetwork(req) : getFromCache(req);
    // подсовываем событию "fetch" результат сформированный нами
    // в вызовах getFromNetwork или getFromCache
    // этот результат будет использован в нашем приложении
    await e.respondWith(res);
});
