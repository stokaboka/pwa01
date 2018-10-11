import './style.css';
// загружаем модуль с методами регистрации service worker
import { registerServiceWorker } from './reg_sw'
// методы загрузки данных
import { loadMoreEntries } from "./api";

// имя файла service worker
// этот файл сформирован на основе
// нашего sw.js workbox-webpack-plugin - ом
// имя файла задано в файле настройке webpack.manifest.js
let serviceWorkerName = '/service-worker.js';

// проверяем возможность обозревателем использовать service worker
if ('serviceWorker' in navigator) {
    // ловим событие "load" - окончание загрузки всех компонентов
    window.addEventListener('load', async () => {
        // регистрируем service worker
        await registerServiceWorker(serviceWorkerName);
        // загружаем данные для работы PWA приложения
        loadMoreEntries();
    });
}

// ловим событие "beforeinstallprompt" - предложение установить
// PWA приложение в системе (при возможности)
// установка возможна только при загрузке по HTTPS
// с сертификатом web-сервера
window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    e.prompt();
});
