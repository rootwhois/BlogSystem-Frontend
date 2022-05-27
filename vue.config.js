const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    // webpack配置
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = '个人博客管理系统';
                return args
            })
    },
    configureWebpack: config => {
        if (isProduction) {
            config.plugins.push(new CompressionWebpackPlugin({
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                minRatio: 0.8
            }))
        }
    },
    // webpack-dev-server 相关配置
    devServer: {
        allowedHosts: "all",
        port: 8081,
        host: '0.0.0.0',
    },
    // 第三方插件配置
    pluginOptions: {}
}