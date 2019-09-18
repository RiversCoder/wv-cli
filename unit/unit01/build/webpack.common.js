const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].bundle.js'
    },
    module:{
        rules: [
        {
            test:/\.js$/, 
            loader: 'babel-loader', 
            exclude:/node_modules/
        },
        {
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
        }]
    },
    resolve:{
        extensions: ['.js', '.vue', '.json'],
        alias:{
            'vue$':'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname,'../src'),
        }
    },
    plugins:[
        // 加载 vue-loader 插件
        new VueLoaderPlugin(),
        // 生成 index.html
        new htmlWebpackPlugin({
            hash: true,
            filename: 'index.html',
            title:'webpack-vue',
            template: './index.html'
        })
    ],
    externals:{
        'jquery': 'window.jQuery'
    },
    performance:{
        hints:false  
    }
}



