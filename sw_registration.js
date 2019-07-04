/* This file is for registering for service worker */
document.addEventListener('DOMContentLoaded', event => {
    if (navigator.serviceWorker) {
        navigator.serviceWorker.register('./sw.js')
        .then(reg => {
            console.log('Service worker registration succeeds: ' + reg.scope);
        })
        .catch(error => {
            console.log('Service worker registration fails: ' + error);
        });
    }
});
