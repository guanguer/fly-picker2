const webpack = require('webpack');
const {resolve} = require('path');

module.exports = {
  context: resolve('src'),
  entry: './fly-picker.module.ts',
  output: {
    path: resolve('dist'),
    filename: 'fly-picker2.js',
    library: 'fly-picker2',
    libraryTarget:'umd'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
        exclude: [/node_modules/, /\.(spec|e2e)\.ts$/]
      },
      { 
        test: /\.(html|css)$/, 
        loader: 'raw-loader'
      },
    ]
  },
  plugins: [
    // Workaround for angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      resolve('src'),
      {}
    )
  ],
  externals: {
    "@angular/core": '@angular/core',
    "@angular/common": '@angular/common'
  }
};
