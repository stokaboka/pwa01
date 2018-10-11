/**
 * регистрация service worker (любого)
 * @param serviceWorker - имя фала js являющегося service worker
 * @returns {Promise<void>}
 */
async function registerServiceWorker(serviceWorker) {
    try {
        // регистрируем service worker
        const registration = await navigator.serviceWorker.register(serviceWorker);
        console.log('ServiceWorker registered: ', registration);
        // пытаемся подписаться на PUSH уведомления
        subscribeToPushNotifications(registration);
    } catch (e) {
        // что-то пошло не так
        // скорее всего отсутствует поддержка service worker
        console.error('ServiceWorker failed', e);
    }
}

async function subscribeToPushNotifications(registration) {
    if ('pushManager' in registration) {
        const options = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array('BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'),
        };
        
        const status = await pushStatus;
        
        if (status) {
            try {
                const subscription = await registration.pushManager.subscribe(options);
                console.log('Push registration registered', subscription);
                //Received subscription
            } catch (e) {
                console.error('Push registration failed', e);
            }
        }
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/')
    ;
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

const pushStatus = new Promise(resolve => {
    Notification.requestPermission(result => {
        const el = document.createElement('div');
        el.classList.add('push-info');
        
        if (result !== 'granted') {
            el.classList.add('inactive');
            el.textContent = 'Push blocked';
            resolve(false);
        } else {
            el.classList.add('active');
            el.textContent = 'Push active';
            resolve(true);
        }
        
        document.body.appendChild(el);
    });
});

export { registerServiceWorker, subscribeToPushNotifications, pushStatus }
