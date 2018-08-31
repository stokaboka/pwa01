/*
Copyright
*/

const {InjectManifest} = require('workbox-webpack-plugin');

module.exports = () => ({
    plugins: [
        new InjectManifest({
            swSrc: './src/sw.js',
            swDest: 'service-worker.js'
        })
    ]
});
