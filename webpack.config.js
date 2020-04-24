const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const isDev = process.env.NODE_ENV !== 'production';

const config = {
    mode: isDev ? 'development' : 'production',
    entry: './src/scripts/app.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin([
            { from: 'src/index.html' },
            { from: 'src/css/style.css', to: 'css/' },
            { from: 'src/images/logo.png', to: 'images/' },
            { from: 'src/images/coin1.png', to: 'images/' },
            { from: 'src/images/coin2.png', to: 'images/' },
            { from: 'src/images/coin3.png', to: 'images/' },
            { from: 'src/images/coin4.png', to: 'images/' },
            { from: 'src/images/coin5.png', to: 'images/' },
            { from: 'src/images/coin6.png', to: 'images/' },
	    { from: 'src/images/coinslot.png', to: 'images/' },
	    { from: 'src/audio/coin_up.wav', to: 'audio/' }
        ]),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8080,
        hot: true
    },
    optimization: {
        minimize: !isDev
      }
};

module.exports = config;
