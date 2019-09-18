const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Mode = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const fs = require('fs');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].bundle.js',
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
        rules: [{
            test:/\.js$/, 
            loader: 'babel-loader', 
            exclude:/node_modules/
        },{
            test:/\.css$/,
            use:[ Mode == 'development'? 'style-loader' : miniCssExtractPlugin.loader, 'css-loader']
        },{
            test:/\.(png|jpe?g|gif|svg)(\?.*)?$/,
            use: [{
                loader: 'file-loader',
                options:{
                    limit:10000,
                    name:'img/[name].[ext]?[hash]'
                }
            }]
        },{
            test:/\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            use:[{
                loader: "url-loader",
                options:{
                    limit:10000,
                    name:'fonts/[name].[ext]?[hash]'
                }
            }]
        },
        {
            test:/\.less$/,
            use:[ Mode == 'development'? 'style-loader' : miniCssExtractPlugin.loader, 'css-loader', 'less-loader' ]
        },
        {
            test:/\.vue$/,
            loader:'vue-loader',
            options:{
                loaders: {
                    'css': '',
                    'less': [ Mode == 'development'? 'vue-style-loader' : miniCssExtractPlugin.loader, 'css-loader', 'less-loader']
                }
            }
        }]
    },
    resolve:{
        extensions: ['.js', '.vue', '.json'],
        alias:{
            'vue$':'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname,'./src'),
        }
    },
    plugins:[
        // 定义全局变量 默认 development
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),
        // 加载 vue-loader 插件
        new VueLoaderPlugin(),
        // 生成 index.html
        new htmlWebpackPlugin({
            hash: true,
            filename: 'index.html',
            title:'webpack-vue',
            template: './index.html'
        }),
        // 热模块替换 HMR
        new webpack.HotModuleReplacementPlugin(),
    ],
    externals:{
        'jquery': 'window.jQuery'
    },
    performance:{
        hints:false  
    }
}

/*
* 生成生产代码的时候才触发 新增全局 process.env.NODE_ENV = "production"
*/
if (process.env.NODE_ENV === 'production') {
    module.exports.mode = 'production'
    module.exports.devtool = '#source-map'
    module.exports.output.publicPath = './'
    module.exports.optimization = {
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
    };
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        // 从文件中提取 css 包括公共文件
        new miniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[name].chunk.css',
        }),
        // clear dist dir
        new CleanWebpackPlugin()
    ])
}


fs.writeFile('./dev-old.json',JSON.stringify(module.exports,null,'\t'), (err) => {
    console.log(err)
});