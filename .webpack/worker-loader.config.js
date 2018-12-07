module.exports = {
  test: /\.worker\.js$/,
  use: {
    loader: 'worker-loader',
    options: {
      inline: true,
      fallback: false,
    }
  }
};
