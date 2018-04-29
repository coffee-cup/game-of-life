const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';
console.log(isProd ? 'Building for production' : 'Building for development');

const envVars = ['NODE_ENV'];

const config = {
  entry: ['./src/index.js'],
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'app.js',
    publicPath: '/'
  },
  devServer: {
    inline: true,
    hot: true,
    contentBase: 'public',
    // stats: 'errors-only',
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        loaders: ['eslint-loader'],
        exclude: [/node_modules/]
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: [/node_modules/]
      },
      {
        test: /\.rs$/,
        use: [
          {
            loader: 'wasm-loader'
          },
          {
            loader: 'rust-native-wasm-loader',
            options: {
              gc: true,
              release: true,
              target: 'wasm32-unknown-unknown'
            }
          }
        ]
      },
      {
        test: /\.(css|scss)$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                config: { path: './postcss.config.js' }
              }
            },
            'sass-loader'
          ]
        })
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loaders: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff'
          }
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/octet-stream'
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'image/svg+xml'
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('app.css'),
    new CopyWebpackPlugin([{ from: './public' }])
  ]
};

if (isProd) {
  config.devServer = {};
  config.devtool = '';
  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new UglifyJsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
} else {
  config.devtool = 'inline-source-map';
  config.performance = {
    hints: false
  };
}

module.exports = config;
