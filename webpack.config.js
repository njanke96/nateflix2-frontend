const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nfConfig = require("./nateflix.config")

/* get the definitions for the define plugin from our config json */
function getGlobalDefinitions() {
    return {
        SERVICE_URL: JSON.stringify(nfConfig.serviceUrl)
    }
}

module.exports = {
    entry: './src/index.js',
    mode: "development",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: { presets: ["@babel/env"] }
            },
            {
                test: /\.(js|jsx)$/,
                use: ["source-map-loader"],
                enforce: "pre"
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: [
                    "file-loader" // load images
                ],
            }
        ]
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },
    output: {
        path: path.resolve(__dirname, "dist/"),
        filename: "bundle.js"
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port: 3000,
        hotOnly: true,
        historyApiFallback: {
            rewrites: [
                { from: /^\/$/, to: '/index.html' }
            ]
        }
    },
    plugins: [
        new webpack.DefinePlugin(getGlobalDefinitions()),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: "src/index.html"
        })
    ],
    devtool: "source-map"
};