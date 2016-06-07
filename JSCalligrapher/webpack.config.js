module.exports = {
  context: __dirname,
  entry: './calligrapher.js',
  output: {
    path: './',
    filename: 'calligrapher_bundle.js'
  },
  loaders: [
    {
      test: /\.js?$/,
    }
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.js']
  }
};
