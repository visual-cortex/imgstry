const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const PATH = {
  src: path.join(__dirname, './lib'),
  build: path.join(__dirname, './dist')
}

module.exports = {
  entry: {
    'imgstry.browser': `${PATH.src}/platform/browser/imgstry/index.js`,
    'imgstry.spline': `${PATH.src}/platform/browser/spline/index.js`,
    'imgstry.pixel': `${PATH.src}/pixel/index.js`,
    'imgstry.kernel': `${PATH.src}/kernel/index.js`,
    'imgstry': `${PATH.src}/index.js`,
  },
  output: {
    path: PATH.build,
    filename: '[name].min.js',
    libraryTarget: 'umd',
    globalObject: `(typeof self !== 'undefined' ? self : this)`,
  },
  devtool: 'source-map',
  optimization: {
    minimizer: [new TerserPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: {
            inline: true,
            fallback: false,
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new webpack.IgnorePlugin(/test\.ts$/)
  ]
}
