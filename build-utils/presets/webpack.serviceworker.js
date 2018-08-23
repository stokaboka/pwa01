const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = () => ({
    plugins: [
        // new WorkboxPlugin.InjectManifest({
        //     swSrc: './src/swx.js'
        // })
        new WorkboxPlugin.GenerateSW({
            // these options encourage the ServiceWorkers to get in there fast
            // and not allow any straggling "old" SWs to hang around
            directoryIndex: 'index.html',
            clientsClaim: true,
            skipWaiting: true,
            // exclude: [/\.jpg$/, /\.png$/],
            include: [/\.html$/, /\.js$/, /\.css$/, /\.json$/],
            runtimeCaching: [
                {
                    // Match any same-origin request that contains 'api'.
                    urlPattern: /\.(?:html|js|css|json)$/,
                    // Apply a network-first strategy.
                    // handler: 'networkFirst',
                    handler: 'staleWhileRevalidate',
                    options: {
                        // Use a custom cache name for this route.
                        cacheName: 'code',
                        // Configure custom cache expiration.
                        expiration: {
                            maxEntries: 5,
                            maxAgeSeconds: 60,
                        },
                        // Configure which responses are considered cacheable.
                        cacheableResponse: {
                            statuses: [0, 200],
                            headers: {'x-test': 'true'},
                        },
                        // Configure the broadcast cache update plugin.
                        broadcastUpdate: {
                            channelName: 'orangem-update-channel',
                        },
                        // Add in any additional plugin logic you need.
                        plugins: [
                            {
                                cacheDidUpdate: () => /* custom plugin code */ console.log('code: cacheDidUpdate')
                            }
                        ],
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
                            channelName: 'my-update-channel',
                        },
                        plugins: [
                            {
                                cacheDidUpdate: () => /* custom plugin code */ console.log('data: cacheDidUpdate')
                            }
                        ],
                    },
                },
                {
                    // Match any same-origin request that contains 'api'.
                    urlPattern: /'api'/,
                    // Apply a network-first strategy.
                    handler: 'networkFirst',
                    options: {
                        // Fall back to the cache after 10 seconds.
                        networkTimeoutSeconds: 10,
                        // Use a custom cache name for this route.
                        cacheName: 'api',
                        // Configure custom cache expiration.
                        expiration: {
                            maxEntries: 5,
                            maxAgeSeconds: 60,
                        },
                        // Configure which responses are considered cacheable.
                        cacheableResponse: {
                            statuses: [0, 200],
                            headers: {'x-test': 'true'},
                        },
                        // Configure the broadcast cache update plugin.
                        broadcastUpdate: {
                            channelName: 'my-update-channel',
                        },
                        // Add in any additional plugin logic you need.
                        plugins: [
                            {
                                cacheDidUpdate: () => /* custom plugin code */ console.log('jsonplaceholder: cacheDidUpdate')
                            }
                        ],
                    },
                },
                {
                    // To match cross-origin requests, use a RegExp that matches
                    // the start of the origin:
                    // urlPattern: new RegExp('^https://cors\.example\.com/'),
                    urlPattern: new RegExp('^https://jsonplaceholder\.typicode\.com'),
                    // handler: 'staleWhileRevalidate',
                    handler: 'networkFirst',
                    options: {
                        cacheName: 'jsonplaceholder',
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                }]
        })
    ]
});
