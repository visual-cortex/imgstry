const TerserPlugin = require('terser-webpack-plugin');

const production = {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [new TerserPlugin()]
  },
  output: {
    filename: '[name].min.js',
    libraryTarget: 'umd',
    globalObject: `(typeof self !== 'undefined' ? self : this)`,
  },
};asdfadsfasdf

module.exports = production;
