require('dotenv').config();
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const config = (env, argv) => {
  const devServerPort = process.env.DEV_PORT ?? 3003;
  // Production builds default to relative path.
  const apiBaseUrl = argv.mode === 'production'
    ? process.env.API_BASE_URL ?? '/api'
    : process.env.API_BASE_URL ?? 'http://localhost:8080/api';

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
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
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
      historyApiFallback: true,
      allowedHosts: 'all'
    },
    devtool: 'source-map',
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Packlister app',
        template: './assets/index.html',
      }),
      new webpack.DefinePlugin({
        API_BASE_URL: JSON.stringify(apiBaseUrl)
      }),
      new CopyPlugin({
        patterns: [
          {
            from: './assets/favicon'
          }
        ]
      })
    ]
  };
};

module.exports = config;
