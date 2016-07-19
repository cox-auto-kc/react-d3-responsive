// For info about this file refer to webpack and webpack-hot-middleware documentation
import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import TransferWebpackPlugin from 'transfer-webpack-plugin';

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production'),
  __DEV__: false
};

// NOTE: The resolve section at the bottom is necessary
// to keep material-ui happy by assuring all references
// to React point to the same spot.
export default {
  debug: true,
  devtool: 'source-map', // More info: https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  noInfo: true, // Set to false to see a list of every file being bundled.
  entry: './src/app/index',
  target: 'web',
  output: { // Note: Only prod environment actually outputs files.
    path: __dirname + '/dist',
    publicPath: '',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS), // Passes variables to Webpack. https://facebook.github.io/react/downloads.html
    //new ExtractTextPlugin('styles.css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {screw_ie8: true, keep_fnames: false, warnings: false},
      mangle: {screw_ie8: true, keep_fnames: false}
    }),
    // Transfer Files
    new TransferWebpackPlugin([
      {from: 'www'}
    ], path.resolve(__dirname,"src"))    
  ],
  module: {
    loaders: [
      {test: /(\.js|\.jsx)$/, include: path.join(__dirname, 'src'), loaders: ['babel']},
      {test: /\.ico(\?v=\d+\.\d+\.\d+)?$/, loader: "url?mimetype=image/x-icon"}
    ]
  },
  resolve: {
    alias: {
      'react': path.join(__dirname, 'node_modules', 'react')
    },
    extensions: ['', '.js', '.jsx']
  }
};