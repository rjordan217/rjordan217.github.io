module.exports = {
  context: __dirname,
  entry: './calligraphy_demo.js',
  output: {
    path: '../javascripts/',
    filename: 'calligraphy_demo_bundle.js'
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
