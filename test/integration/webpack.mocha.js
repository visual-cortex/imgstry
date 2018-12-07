const path = require('path');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const TSLoader = require('../../.webpack/ts-loader.config');
const WorkerLoader = require('../../.webpack/worker-loader.config');

const PATH = {
  src: path.join(__dirname, './'),
  build: path.join(__dirname, './dist'),
  config: path.join(__dirname, '../tsconfig.json'),
}

module.exports = {
  mode: 'development',
  entry: `mocha-loader!${PATH.src}/tests/index.ts`,
  output: {
    path: PATH.build,
    filename: 'test.bundle.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      TSLoader,
      WorkerLoader,
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [
      new TsConfigPathsPlugin({
        configFile: PATH.config,
      })
    ]
  }
}
