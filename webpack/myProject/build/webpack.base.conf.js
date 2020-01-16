const path = require('path');
const utils = require('./utils');
const config = require('./config');
const vueLoaderConfig = require('./vue-loader.conf');
const HtmlWebpackPlugin = require('html-weboack-plugin');
const {
    VueLoaderPlugin
} = require('vue-loader');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const StyleLintConfig = require('../stylelint.config');

const envIsProd = process.env.NODE_ENV === config.build.NODE_ENV;
const resolve = dir => path.join(__dirname, '..', dir);

const createEsLintingRule = () => ({
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [resolve('src'), resolve('test')],
    options: {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: !config.dev.showEslintErrorsInOverlay
    }
})
const webpackConfig = {
    entry: config.base.entry,
    output: {
        path: config.build.assetsRoot, // 输出地址！必须是绝对路径！
        publicPath: envIsProd ? config.build.assertsPublicPath : config.dev.assertsPublicPath, // 引用资源的公共路径;绝对或者相对路径
        fileName: envIsProd ? config.build.fileName : config.dev.fileName, // 文件名
        chunkFilename: envIsProd ? config.build.chunkFilename : config.dev.chunkFilename // 包名
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            ...config.base.alias
        }
    },
    module: {
        rules: [
            ...(config.dev.useEslint ? [createEsLintingRule()] : []),
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                Options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assertPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            fileName: envIsProd ? config.build.htmlFileName : config.dev.htmlFileName,
            favicon: config.base.favicon, // 网站icon;必须绝对路径
            template: config.base.indexTpl,
            inject: true,
            title: config.base.title,
            minify: envIsProd ? {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            } : false,
            xdVersion: new Date().toLocaleString('zh', {
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: false
            }),
        }),
        new StyleLintPlugin({
            ...StyleLintConfig,
            syntax: 'less',
            files: (function () {
                const suffixes = ['less', '.vue', '.css', '.scss'];
                return suffixes.map(suffix => `./src/**/*${suffix}`);
            })()
        })
    ],
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}

(config.base.plugins || []).forEach(function (plugin) {
    webpackConfig.plugins.push(plugin);
});
module.exports = webpackConfig;