/*
Copyright
*/

// загружаем workbox-webpack-plugin
const {InjectManifest} = require('workbox-webpack-plugin');

// настраиваем workbox-webpack-plugin в режиме InjectManifest
module.exports = () => ({
    plugins: [
        new InjectManifest({
            // файл service worker написанный нами
            swSrc: './src/sw.js',
            // под именем service-worker.js наш файл попадет в сборку
            swDest: 'service-worker.js'
        })
    ]
});
