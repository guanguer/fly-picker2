const webpack = require('webpack');
module.exports = {
  entry: {
    'fly-picker2.umd': './dist/index.js',
    'fly-picker2.umd.min': './dist/index.js' 
  },

  devtool: 'source-map',

  output: {
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    library: 'fly-picker2',
    libraryTarget: 'umd'
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ],
  externals: {
    "@angular/core": '@angular/core',
    "@angular/common": '@angular/common'
  }
};
