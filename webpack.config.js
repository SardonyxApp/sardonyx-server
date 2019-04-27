const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'login': ['@babel/polyfill', './src/login/login.js'],
    'password': ['@babel/polyfill', './src/login/password.js'],
    'app': ['./src/app/App.js'],
    'ieapp': ['@babel/polyfill', 'whatwg-fetch', './src/app/App.js']
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'scripts/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.svg$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['login'],
      template: './src/login/login.html',
      filename: './login/index.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['password'],
      template: './src/login/password.html',
      filename: './password/index.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['app'],
      template: './src/app/app.html',
      filename: './app/index.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['ieapp'],
      template: './src/app/ie.html',
      filename: './app/ie.html'
    })
  ]
};
