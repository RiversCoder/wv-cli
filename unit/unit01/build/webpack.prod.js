const path = require('path');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const commonConfig = require('./webpack.common.js');
const merge = require('webpack-merge');

const prodConfig = {
    mode: 'production',
    output: {
        publicPath: './'
    },
    devtool: '#source-map', 
    module:{
        rules: [{
            test:/\.css$/,
            use:[ miniCssExtractPlugin.loader, 'css-loader']
        },
        {
            test:/\.less$/,
            use:[ miniCssExtractPlugin.loader, 'css-loader', 'less-loader' ]
        },
        {
            test:/\.vue$/,
            loader:'vue-loader',
            options:{
                loaders: {
                    'css': [ miniCssExtractPlugin.loader, 'css-loader'],
                    'less': [ miniCssExtractPlugin.loader, 'css-loader', 'less-loader']
                }
            }
        }]
    },
    plugins:[
        // 从文件中提取 css 包括公共文件
        new miniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[name].chunk.css',
        }),
        // clear dist dir
        new CleanWebpackPlugin()
    ],
    optimization: {
        minimizer: [ new OptimizeCSSAssetsPlugin({}) ], // 压缩 css
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    test: /\.(css|js)$/,
                    chunks: 'all',
                    enforce: true,
                }
            }
        }
    }
}


module.exports = merge(commonConfig, prodConfig);
