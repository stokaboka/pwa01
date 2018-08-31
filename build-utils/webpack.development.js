const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = () => ({
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        // Copy empty ServiceWorker so install doesn't blow up
        new CopyWebpackPlugin([
            'src/swx.js',
            'src/favicon.ico'
            ])
    ],
    devtool: 'source-map'
});
