// development config
const merge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'development',
  entry: [
    './index.ts' // the entry point of our app
  ],
  devtool: 'cheap-module-eval-source-map'
});
