require('dotenv').config();
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const config = (env, argv) => {
  const devServerPort = process.env.DEV_PORT ?? 3003;
  // production builds need to define url
  const apiBaseUrl = argv.mode === 'production'
    ? process.env.API_BASE_URL
    : process.env.API_BASE_URL ?? 'http://localhost:8080/api';
  if (apiBaseUrl === undefined) {
    throw new Error('Missing value for API_BASE_URL');
  }

  return {
    entry: './src/index.tsx',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'build'),
      publicPath: '/'
    },
    devServer: {
      static: path.resolve(__dirname, 'build'),
      compress: true,
      port: devServerPort,
      hot: true,
      historyApiFallback: true
    },
    devtool: 'source-map',
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Packlister app',
        template: './assets/index.html',
      }),
      new webpack.DefinePlugin({
        API_BASE_URL: JSON.stringify(apiBaseUrl)
      })
    ]
  };
};

module.exports = config;
