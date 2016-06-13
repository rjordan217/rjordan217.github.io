module.exports = {
  context: __dirname,
  entry: './mandelbrot.js',
  output: {
    path: './',
    filename: 'mandelbrot_bundle.js'
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
