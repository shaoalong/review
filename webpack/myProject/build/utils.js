'use strict'
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('../config')

exports.cssLoaders = function(options) {
    options = options || {};
    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap
        }
    };

    const postCssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }

    function generateLoaders(loader, loaderOptions) {
        const loaders = options.usePostCss ? [cssLoader,postCssLoader] : [cssLoader];
        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: { ...loaderOptions, sourceMap: options.sourceMap }
            })
        }
        if (options.extract) {
            return {
                use: [MiniCssExtractPlugin.loader, ...loaders],
                fallback: 'vue-style-loader'
            }
        }
        return ['vue-style-loader', ...loaders];
    }

    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less', { javascriptEnabled: true }),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    }
};

exports.styleLoaders = function(options) {
    const output = [];
    const loaders = exports.cssLoaders(options);

    for (const extension in loaders) {
        const loader = loaders[extension];
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }

    return output;
}


exports.assertPath = function(_path) {
    const assertSubDirectory = process.env.NODE_ENV === 'production' ? config.build.assertSubDirectory : config.dev.assertSubDirectory;
    return path.posix.join(assertSubDirectory, _path)
}