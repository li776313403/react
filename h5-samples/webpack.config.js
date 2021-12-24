/*
 * @Descripttion: webpack配置文件
 * @version: 2.0
 * @Author: 李雯
 * @Date: 2021-12-16 19:35:09
 * @LastEditors: 李雯
 * @LastEditTime: 2021-12-22 18:53:59
 */
//引用webpack
const webpack = require('webpack');
const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
//模块导出
module.exports = {
  //入口文件
  entry: './src/index.tsx',
  //开发调试时可以看到源码
  devtool: 'source-map',
  //模块
  module: {
    unknownContextCritical : false,
    //规则
    rules: [
      //加载js|jsx|tsx源码文件
      {
        test: /\.(js|jsx|tsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-typescript'],
          plugins: [
            ['@babel/plugin-transform-typescript', { allowNamespaces: true }],
          ]
        },
      },
      //加载scss|less|css等样式文件
      {
        test: /\.(scss|less|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
    ]
  },
  //配置如何寻找模块所对应的文件
  resolve: {
    //寻找所有js,jsx,tsx文件
    extensions: ['*', '.js', 'jsx', '.tsx']
  },
  //输出文件配置
  output: {
    //输出路径 __dirname表示当前目录
    path: __dirname + '/public',
    //公共路径为项目根目录
    publicPath: '/',
    //打包后输出文件名
    filename: 'samples.js'
  },
  //webpack插件
  plugins: [
    //热加载插件
    new webpack.HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin({
      // 将async设为false，可以阻止Webpack的emit以等待类型检查器/linter，并向Webpack的编译添加错误。
      async: false
    }),
    // 将TypeScript类型检查错误以弹框提示
    // 如果fork-ts-checker-webpack-plugin的async为false时可以不用
    // 否则建议使用，以方便发现错误
    new ForkTsCheckerNotifierWebpackPlugin({
      title: 'TypeScript',
      excludeWarnings: true,
      skipSuccessful: true,
    }),
  ],
  //开发服务器配置
  devServer: {
    //是否热加载
    hot: true,
    //加载IP地址
    host: '192.168.0.36',
  }
};