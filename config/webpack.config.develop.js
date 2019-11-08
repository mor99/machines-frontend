const autoprefixer = require('autoprefixer')
const flexbugs = require('postcss-flexbugs-fixes')
const { port, proxy, isIpHost, isHttps } = require('./index')
const { theme, IP } = require('./util')
const path = require('path')

const Host = isIpHost ? IP : 'localhost'

module.exports = {
  mode: 'development',
  entry: {
    index: [
      'react-hot-loader/patch',
      `webpack-dev-server/client?${isHttps ? 'https' : 'http'}://${Host}:${port}`,
      'webpack/hot/only-dev-server',
      './src/index.js'
    ]
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                flexbugs,
                autoprefixer({
                  browsers: ['last 6 versions', 'android >= 4.0', 'ios >= 5.0', '>1%', 'Firefox ESR', 'not ie < 9']
                })
              ]
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                flexbugs,
                autoprefixer({
                  browsers: ['last 6 versions', 'android >= 4.0', 'ios >= 5.0', '>1%', 'Firefox ESR', 'not ie < 9']
                })
              ]
            }
          },
          {
            loader: 'less-loader',
            options: {
              modifyVars: theme
            }
          }
        ]
      }
    ]
  },
  devServer: {
    proxy,
    contentBase: path.resolve('dist'),
    hot: true,
    publicPath: '/',
    inline: true,
    host: isIpHost ? IP : 'localhost',
    open: true,
    https: isHttps,
    historyApiFallback: true,
    disableHostCheck: true,
    compress: true,
    stats: { colors: true },
    port: port
  }
}
