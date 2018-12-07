const path = require('path');
const webpack = require('webpack');
const merge = require("webpack-merge");
const TerserPlugin = require('terser-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const PATH = {
  src: path.join(__dirname, './source'),
  build: path.join(__dirname, './dist'),
  config: path.join(__dirname, './tsconfig.json'),
}

const production = {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [new TerserPlugin()]
  },
  output: {
    path: PATH.build,
    filename: '[name].min.js',
    libraryTarget: 'umd',
    globalObject: `(typeof self !== 'undefined' ? self : this)`,
  },
};

const debug = {
  mode: 'development',
  output: {
    path: PATH.build,
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

const base = {
  entry: {
    'imgstry.browser': `${PATH.src}/platform/browser/imgstry/index.ts`,
    'imgstry.spline': `${PATH.src}/platform/browser/spline/index.ts`,
    'imgstry.pixel': `${PATH.src}/pixel/index.ts`,
    'imgstry.kernel': `${PATH.src}/kernel/index.ts`,
    'imgstry': `${PATH.src}/index.ts`,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: {
            inline: true,
            fallback: false,
          }
        }
      },
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
