const merge = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = env => {
  const baseConfig = {
    module: {
      rules: [
        {
          // 使用babel-loader将ES6语法转换为ES5
          test: /\.js$/,
          include: [
            path.resolve(__dirname, 'node_modules/@supermap/iclient-openlayers'),
            path.resolve(__dirname, 'node_modules/@supermap/iclient-common'),
            // 由于iClient对Elasticsearch的API进行了封装而Elasticsearch也使用了ES6的语法
            path.resolve(__dirname, 'node_modules/elasticsearch')
          ],
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        },
        // {
        //   test: /\.(js|jsx)$/,
        //   loader: 'eslint-loader',
        //   enforce: 'pre',
        //   include: [path.resolve('src')],
        //   options: {
        //     formatter: require('eslint-friendly-formatter')
        //   }
        // },
        {
          test: /\.jsx?$/,
          include: [path.resolve('src')],
          loader: 'babel-loader'
        },
        {
          test: /\.md$/,
          use: [
            {
              loader: 'html-loader'
            },
            {
              loader: 'markdown-loader',
              options: {
                /* your options here */
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|gif|ico|jpeg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: { name: 'images/[name].[hash:8].[ext]' }
            }
          ]
        },
        {
          test: /\.(ogg|mp3)$/i,
          use: [
            {
              loader: 'file-loader',
              options: { name: 'assets/[name].[hash:8].[ext]' }
            }
          ]
        },
        {
          test: /\.(eot|ttf|svg|woff|woff2)$/i,
          use: [
            {
              loader: 'file-loader',
              options: { name: 'fonts/[name].[hash:8].[ext]' }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.json'],
      alias: {
        '&': path.resolve('src'),
        Request: path.resolve('src/libs/api/index')
      },
      modules: [
        path.resolve('src'),
        path.resolve('.'),
        'node_modules'
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        _: 'lodash',
        moment: 'moment',
        classnames: 'classnames',
        Delete: ['Request', 'Delete'],
        Get: ['Request', 'Get'],
        Post: ['Request', 'Post'],
        Put: ['Request', 'Put'],
        Patch: ['Request', 'Patch']
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.html',
        favicon: path.resolve(__dirname, '../src/favicon.ico'),
        inject: true
      })
    ]
  }
  if (env && env.prod === 'prod') {
    return merge(baseConfig, require('./webpack.config.production'))
  } else {
    return merge(baseConfig, require('./webpack.config.develop'))
  }
}
