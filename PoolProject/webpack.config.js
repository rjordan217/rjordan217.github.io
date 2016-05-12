module.exports = {
  context: __dirname,
  entry: './for_bundling.js',
  output: {
    path: './',
    filename: 'bundle.js'
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
