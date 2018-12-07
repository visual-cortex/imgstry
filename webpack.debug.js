const webpack = require('webpack');

const debug = {
  mode: 'development',
  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
    globalObject: `(typeof self !== 'undefined' ? self : this)`,
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ]
};

module.exports = debug;
