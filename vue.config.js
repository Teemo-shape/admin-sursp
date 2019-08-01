const path = require("path")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';

function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    publicPath: './',
    lintOnSave:false,  // 关闭eslint
    productionSourceMap: false,
    devServer: {
        open:true,
        port:8080,
        // proxy: {
        //     '/api':{
        //         // target:'http://192.168.1.111:8686/mall-web',
        //         target:'http://qf.duoduo13.com/sursp-admin',
        //         changeOrigin:true,
        //         pathRewrite:{
        //             '/api':''
        //         }
        //     },
        // }
    },
    css: {  // 一次配置，全局使用，这个scss 因为每个文件都要引入
        // sourceMap: false,
        loaderOptions: {
            sass: {
                data: `@import "@/assets/css/index.scss";`
            }
        }
    },
    chainWebpack:config=>{
        // 配置别名
        config.resolve.alias
            .set("@", resolve("src"))
            .set("@img", resolve("src/assets/images"))
    },
    configureWebpack: config => {
        if (isProduction) {
            // 为生产环境修改配置...
            config.plugins.push(
                //添加代码压缩工具，及设置生产环境自动删除console
                // new UglifyJsPlugin({
                //     uglifyOptions: {
                //         compress: {
                //             warnings: false,
                //             drop_debugger: true,
                //             drop_console: true,
                //         },
                //     },
                //     sourceMap: false,
                //     parallel: true,
                // })
            );
        } else {
            // 为开发环境修改配置...
        }
    },
}