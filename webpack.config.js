const path = require('path');
const webpack = require('webpack');
const merge = require("webpack-merge");
const TerserPlugin = require('terser-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const TSLoader = require('./.webpack/ts-loader.config');
const WorkerLoader = require('./.webpack/worker-loader.config');

const PATH = {
  src: path.join(__dirname, './source'),
  build: path.join(__dirname, './dist'),
  config: path.join(__dirname, './tsconfig.json'),
}

const production = require('./webpack.production');
const debug = require('./webpack.debug');

const base = {
  entry: {
    'imgstry.browser': `${PATH.src}/platform/browser/imgstry/index.ts`,
    'imgstry.spline': `${PATH.src}/platform/browser/spline/index.ts`,
    'imgstry.pixel': `${PATH.src}/pixel/index.ts`,
    'imgstry.kernel': `${PATH.src}/kernel/index.ts`,
    'imgstry': `${PATH.src}/index.ts`,
  },
  output: {
    path: PATH.build,
  },
  module: {
    rules: [
      TSLoader,
      WorkerLoader,
    ]
  },
  resolve: {
    extensions: ['.js', '.ts'],
    plugins: [
      new TsConfigPathsPlugin({
        configFile: PATH.config,
      })
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/test\.ts$/)
  ]
}

module.exports = (mode) => {
  switch (mode.target) {
    case 'prod':
      return merge(base, production);
    case 'debug':
      return merge(base, debug);
  }
}
