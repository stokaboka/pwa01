// загружаем workbox-webpack-plugin
const {GenerateSW} = require('workbox-webpack-plugin');

// создаем и  экспортируем экземпляр GenerateSW
// и передаем в GenerateSW объект конфигурации
module.exports = () => ({
    plugins: [
        new GenerateSW({
        
// если URL заканчивается / (должен загрузиться directory index)
// и запрос возвращает ошибку, то будет добавлено
// значение параметра directoryIndex к URL
// для поиска в кеше
// по умолчанию index.html
            directoryIndex: 'index.html',
    
// service worker при первой загрузке не сможет обрабатывать fetch события и управлять страницей
// пока не завершаться стадии установки (событие install) и активации (событие  active).
// кроме того, события fetch не будут обрабатываться пока через service worker не пройдет загрузка страницы
// это значит, что страницу нужно обновить (F5)
// это поведение является поведением по умолчанию
// чтобы избежать необходимости делать перезагрузку страницы после первой загрузки (установки SW)
// мы можем установить значение clientsClaim: true
// в этом случае клиент берется под контроль сразу после фазы активации (событие  active)
// но это может вызвать проблемы при одновременной первой загрузке страницы
// в разных окнах или вкладках из-за не до конца сформированношо пре-кеша
// правильнее использовать значение clientsClaim: false
// в этом случае страница берется под контроль после перезагрузки
// когда index страницы обработается SW и теперь находится в согласованном состоянии
            clientsClaim: true,
            
// service worker может быть обновлен при очередной загрузке страницы
// по умолчанию, все "старые", но активные service worker должны
// потерять контроль над клиентами
// в общем случае это происходит после закрытия всех вкладок с этим URL
// и перезагрузки URL в одном единственном окне
// тогда контроль перейдет к обновленному service worker
// пока "старые" SW имеет контроль над клиентами у нас работает два SW
// - "старый", активный контролирующий клиентов
// - "новый", прошедший фазу установки (install) и находящийся в фазе ожидания (waiting)
// фаза ожидания "нового" SW будет продолжаться пока не закроются все окна или вкладки (клиенты)
// контролируемые "старым" SW
// это иллюстрируется схемой жизненного цикла service worker:
// install -> waiting -> activate
// в данном случае стадия waiting - это ожидание деактивации "старых" SW
// надо отметить, что это имеет смысл, если clientsClaim: true
// мы можем задать поведение SW в этой ситуации:
// - ожидать освобождения всех клиентов - skipWaiting: false
// - не ждать других клиентов - skipWaiting: true
// в этом случае другие, "старые" SW если они активны и работают
// будут убиты
// таким образом может оказаться, что старая версия страницы/приложения
// работает с новым SW
// это нужно иметь ввиду и учитывать при конфигурировании SW
// и разработки страницы / приложения
            skipWaiting: true,
    
// запретить кеширование для файлов отвечающих следующим критериям
// только пример
// кешировать картинки можно и нужно!
            exclude: [/\.jpg$/, /\.png$/],
            
// включить кеширование для файлов отвечающих следующим критериям
            include: [/\.html$/, /\.js$/, /\.css$/, /\.json$/],
            
// правила действующие во время выполнения приложения
// обработка запросов API и т.п.
// этих правил может быть много, по разным типам данным и стратегиям кеширования
            runtimeCaching: [
                {
// строка или регулярное выражение для отбора запросов
// подходящих для данного кеша
                    urlPattern: /\.(?:html|js|css|json)$/,
                    
// стратегия обработки запросов, сохранения и выборки из кеша
// варианты:
// - cacheFirst: всегда обращение в кеш, если в кеше нет, то попытка загрузить из сети. некритичные для приложения данные
// - cacheOnly: запрос только из кеша, данные должны бать предварительно загружены в кеш. используется редко
// - networkFirst: запросы всегда в первую очередь отправляются в сеть и только в случае ошибки выбираются из кеша. подходит для часто меняющихся, динамических данных
// - networkOnly: запросы всегда отправляются тоько в сеть. в кеше ничего не сохраняется
// - staleWhileRevalidate: позволяет отвечать на запросы как можно быстрее: из кеша, если запрос кеширован, из сети если в кеше нет запроса. данные полученные из сети всегда обновляют кеш
// подробнее: https://developers.google.com/web/tools/workbox/modules/workbox-strategies
                    handler: 'staleWhileRevalidate',
                    
                    options: {
                    
// время ожидания ответа от сервера
                        networkTimeoutSeconds: 10,
                        
// имя кеша
                        cacheName: 'code',
                        
// срок жизни кеша
                        expiration: {
// лимит кешированных записей, если достугнут лимит будут удаляться старые записи
                            maxEntries: 5,
// время жизни кеша, после которого кеш нужно обновлять
                            maxAgeSeconds: 86400,
                        },
                        
// на основании каких факторов можно принять решение о помещении полученных из сети данных в кеш
// если условие выполнено, данные можно сохранить в кеш
// значением по умолчанию является:
// - стратегия staleWhileRevalidate: statuses: [0, 200]
// - стратегия cacheFirst: statuses: [200]
// - headers: по умолчанию не проверяется
// в данном случае проверяется оба условия:
                        cacheableResponse: {
// допустимые коды статусы ответа сервера
                            statuses: [0, 200],
// допустимые заголовки ответа сервера
                            headers: {'x-test': 'true'},
                        },
                        broadcastUpdate: {
// запросы, хранящиеся в кеше могут устаревать и тогда workbox принимает решение
// обновить эти устаревшие записи выполнив запрос в
// сеть вместо извлечения данных из кеша
// это используется стратегией staleWhileRevalidate
// - на шаге "revalidate" проверяются заголовки ответа из сети
// и если заголовки отличаются от заголовков сохраненного в кеше запроса
// по умолчанию проверяются заголовки: Content-Length, ETag, и Last-Modified
// тело ответа не проверяется для улучшения производительности
// при помощи BroadcastChannel API ( https://developers.google.com/web/updates/2016/09/broadcastchannel )
// делается оповещение клиента об изменившися данных
                            channelName: 'orangem-update-channel',
                        }
                        
                    },
                },
                {
                    urlPattern: /\.json$/,
                    handler: 'networkFirst',
                    options: {
                        networkTimeoutSeconds: 10,
                        cacheName: 'data',
                        expiration: {
                            maxEntries: 5,
                            maxAgeSeconds: 60,
                        },
                        cacheableResponse: {
                            statuses: [0, 200],
                            headers: {'x-test': 'true'},
                        },
                        broadcastUpdate: {
                            channelName: 'orangem-data-channel',
                        }
                    },
                },
                
                {
                    urlPattern: /'api'/,
                    handler: 'networkFirst',
                    options: {
                        networkTimeoutSeconds: 10,
                        cacheName: 'api',
                        expiration: {
                            maxEntries: 5,
                            maxAgeSeconds: 60,
                        },
                        cacheableResponse: {
                            statuses: [0, 200],
                            headers: {'x-test': 'true'},
                        },
                        broadcastUpdate: {
                            channelName: 'orangem-api-channel',
                        }
                    },
                },
                
                {
                    urlPattern: new RegExp('^https://jsonplaceholder\.typicode\.com'),
                    // handler: 'staleWhileRevalidate',
                    handler: 'networkFirst',
                    options: {
                        cacheName: 'jsonplaceholder',
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                }
                
            ]
        })
    ]
});
