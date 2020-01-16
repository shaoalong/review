const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader:'style-loader',
          },
          // "file-loader",
          'css-loader'
        ]
      },
    ]
  }
};







// style-loader: 在页面中添加style或者link 样式表
  // 默认是插入style，当style-loader/url时以link的方式引入
  // style-loader/useable引入计数器 ： 
    // import style from './main.useable.css';
    // style.use();/style.ref(); //页面加入样式表
    // style.unuse();/style.unref(); //页面去除样式表
    // options: {
    //   hmr:true,
    //   base:true, //设置模块 ID 基础 
    //   attrs:{id: 'id'}, // 添加自定义 attrs
    //   transform: 'path/to/transform.js', //转换/条件加载 CSS，通过传递转换/条件函数
    //   insertAt: { //在给定位置处插入 <style></style>
    //       before: '#id'
    //   },
    //   insertInto:'#id', //给定位置中插入 <style></style>
    //   sourceMap: false, //启用/禁用 Sourcemap
    //   convertToAbsoluteUrls: false, //启用 source map 后，将相对 URL 转换为绝对 URL
    // },
  
  // css-loader :解析 引入的样式
    // options: {
    //   root:'/', //解析 URL 的路径，以 / 开头的 URL 不会被转译
    //   url:true, // 启用/禁用 url() 处理
    //   alias: { //创建别名更容易导入一些模块
    //     "../fonts/bootstrap":"bootstrap-sass/assets/fonts/bootstrap"
    //   },
    //   minimize:false, //启用/禁用 压缩
    //   sourcemap:false, //启用/禁用 Sourcemap
    //   camelCase: true, //以驼峰化式命名导出类名
    //   importLoaders: 0 //在css-loader 前应用的 loader 的数量。0 => 无 loader(默认); 1 => postcss-loader; 2 => postcss-loader, sass-loader
    // }

  // file-loader: 返回请求文件的url
    // options:{
    //   name: '[name].[hash:7].[ext]', 
    //   publicPath: 'asserts/',
    //   outputPath: 'images/'
    // }
  // url-loader：类似于file-loader 但文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL。
    // options: {
    //   limit: 1024, // 低于1024返回DataURL
    //   mimetype:'image/png', //指定文件类型
    // }

  // postcss-loader: 