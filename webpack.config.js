/*
Copyright
*/

let path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    
    mode: 'development',
    entry: './src/app.js',
    devtool: 'inline-source-map',
    
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js'
    },
    
    devServer: {
        contentBase: './public'
    },
    
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Development'
        })
    ],

};
