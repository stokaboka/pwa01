/*
Copyright
*/

let path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');

const modeConfig = env => require(`./build-utils/webpack.${env.mode}.js`)(env);
const loadPresets = require('./build-utils/loadPresets');

module.exports = ({ mode, presets }) => {
    console.log(`mode=${mode}`);
    return webpackMerge({
        mode,
        entry: './src/app.js',
        
        output:{
                path: path.resolve(__dirname, 'dist'),
                filename: 'app.js'
            },
        
        devServer:{
                contentBase: './public',
                https: true
            },
        
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Test PWA - 01',
                template: './src/index.html'
            })
        ]

    },
        modeConfig({ mode, presets }),
        loadPresets({ mode, presets })
    )
};
