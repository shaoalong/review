// 设置process.env.NODE_ENV的方法：
//     1.webpack -p 
//     2.在webpack的配置文件的plugins中通过webpack.DefinePlugin定义
//     3.webpack --mode production
//     4.在配置文件中设置mode
//     5.corss-env 设置
// 总结：
//     方法1、2、3、4定义的NODE_ENV，在webpack配置文件中获取不到，只能在文件中获取。
//     方法5定义的NODE_ENV，webpack与文件中都能够获取。


// webpack4
        {
            mode: 'production',
            plugins: [
                // new webpack.DefinePlugin({
                //     'process.env.NODE_ENV': JSON.stringify('production'),
                // })
                // new webpack.optimize.UglifyJsPlugin({
                //     compress:{  
                //        warnings:false
                //     }
                // }),
                // new webpack.optimize.CommonsChunkPlugin({
                //     names: 'vendor',
                //     minChunks: Ifinity,
                // }),
            ],
            optimization: {
                minimizer: [
                    new UglifyJsPlugin({
                        uglifyOptions: {
                            compress: process.env.NODE_ENV === 'production'
                        }
                    })
                ],
                splitChunks: {
                    cacheGroups: {
                        vendor: {
                            name: 'vendor',
                            chuunks: 'all'
                        }
                    }
                }
            }
        }
        // 1.新增mode来代替plugins中通过webpack.DefinePlugin设置process.env.NODE_ENV.
        // 2.新增optimization来代替plugins中的UglifyJsPlugin及CommonsChunkPlugin
        // 3.新增mini-css-extract-plugin代替extract-text-webpack-plugin
            // MiniCssExtractPlugin.loader,  // replace ExtractTextPlugin.extract({..})