var webpack = require('webpack');

var PROD = JSON.parse(process.env.PROD_ENV || '0');

module.exports = {
  context: __dirname,
  entry: './mandelbrot.js',
  loader:
    {
      test: /\.js?$/,
    },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js']
  },
  output: {
    path: './',
    filename: PROD ? 'mandelbrot_bundle.min.js' : 'mandelbrot_bundle.js'
  },
  plugins: PROD ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ] : []
};
