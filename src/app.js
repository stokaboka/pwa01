import './style.css';
import { registerServiceWorker } from './reg_sw'
import { loadMoreEntries } from "./api";

let serviceWorkerName = '/service-worker.js';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        await registerServiceWorker(serviceWorkerName);
        loadMoreEntries();
    });
}

window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    e.prompt();
});
