const path = require('path')
const webpack = require('webpack')
const commonConfig = require('./webpack.common.js')
const merge = require('webpack-merge');
const fs = require('fs');

const devConfig = {
    mode: 'development',
    output: {
        publicPath: '/'
    },
    devtool: '#eval-source-map',
    devServer:{
        contentBase: path.resolve(__dirname,'dist'),
        port: 3002,
        open: false,
        hot: true
    },
    module:{
        rules: [
        {
            test:/\.css$/,
            use:[ 'style-loader', 'css-loader' ]
        },
        {
            test:/\.less$/,
            use:[ 'style-loader', 'css-loader', 'less-loader' ]
        },
        {
            test:/\.vue$/,
            loader:'vue-loader',
            options:{
                loaders: {
                    'css': '',
                    'less': [ 'vue-style-loader', 'css-loader', 'less-loader']
                }
            }
        }]
    },
    plugins:[
        // 热模块替换 HMR
        new webpack.HotModuleReplacementPlugin(),
    ]
}

fs.writeFile('./dev.json',JSON.stringify(merge(commonConfig, devConfig),null,'\t'), (err) => {
    console.log(err)
});

module.exports = merge(commonConfig, devConfig);