import './style.css';
import { getPosts, getUsers, loadEntries, loadMoreEntries, appendEntries } from './ui'
import { subscribeToPushNotifications, pushStatus } from './api'

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
            subscribeToPushNotifications(registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}

window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    e.prompt();
});
