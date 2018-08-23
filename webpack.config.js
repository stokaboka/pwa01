/*
Copyright
*/

let path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpackMerge = require('webpack-merge');

const modeConfig = env => require(`./build-utils/webpack.${env.mode}.js`)(env);
const loadPresets = require('./build-utils/loadPresets');

module.exports = ({ mode, presets }) => {
    return webpackMerge({
        mode,
        entry: './src/app.js',
        devtool: 'inline-source-map',
        
        output:
            {
                path: path.resolve(__dirname, 'dist'),
                filename: 'app.js'
            },
        
        devServer:
            {
                contentBase: './public',
                https: true
            },
        
        plugins: [
            new CleanWebpackPlugin(['dist']),
            // new ProgressPlugin(),
            new HtmlWebpackPlugin({
                title: 'Test PWA - 01',
                template: './src/index.html'
            })
        ],
        
        module:
            {
                rules: [
                    {
                        test: /\.css$/,
                        use: [
                            'style-loader',
                            'css-loader'
                        ]
                    }
                ]
            }
    },
        modeConfig({ mode, presets })),
        loadPresets({ mode, presets })
};
