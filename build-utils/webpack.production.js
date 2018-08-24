const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = () => ({
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(
            ['../dist'],
            {
                root: process.cwd(),
                verbose: true,
                dry: false
            }
            ),
        new MiniCssExtractPlugin()
    ]
});
