const path = require('path');
const webpack = require('webpack');

const PATH = {
  src: path.join(__dirname, './'),
  build: path.join(__dirname, './dist')
}

module.exports = {
  mode: 'development',
  entry: {
    'imgstry.test': `${PATH.src}/imgstry.test.ts`,
  },
  output: {
    path: PATH.build,
    filename: '[name].js',
    libraryTarget: 'umd',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      },
      {
        test: /\.worker\.ts$/,
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
    extensions: ['.ts', '.js']
  }
}
