const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const rootDir = path.resolve(__dirname)
const cdn = process.env.CDN || ''

module.exports = {
  context: path.join(rootDir, 'src'),
  entry: {
    vendor: [
      path.join(rootDir, 'src/js/vendor.js')
    ],
    app: [
      path.join(rootDir, 'src/js/app.js'),
      path.join(rootDir, 'src/css/app.css'),
    ]
  },
  output: {
    path: path.join(rootDir, 'dist'),
    publicPath: cdn,
    filename: 'js/[name].[hash:5].js'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              pathPath: cdn
            }
          },
          'css-loader',
        ],
      },
      {
        test: /\.(ico|jpg|png|gif|svg|bmp|webp|mp4)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[path][name].[hash:6].[ext]',
              publicPath: cdn,
              emitFile: true,
              context: 'src/img'
            }
          }
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([
      path.join(rootDir, 'dist')
    ], {
      verbose: true,
      watch: false,
      allowExternal: true
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(rootDir, 'src/index.html'),
      filename: path.join(rootDir, 'dist/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: '[id].css',
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(rootDir, 'src/img'),
        to: 'img'
      },
      {
        from: path.join(rootDir, 'src/data'),
        to: 'data'
      }
    ])
  ],
  resolve: {
    extensions: ['.css', '.js'],
    modules: [
      'node_modules',
      'src'
    ]
  }
}
