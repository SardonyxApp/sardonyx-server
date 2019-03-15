const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		'index': ['@babel/polyfill', './src/index.js'],
		'login': ['@babel/polyfill', './src/login/login.js'],
		'app': ['@babel/polyfill', './src/app/App.js']
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
			chunks: ['index'],
			template: './src/index.html',
			filename: 'index.html'
		}),
		new HtmlWebpackPlugin({
      chunks: ['login'],
      template: './src/login/login.html',
			filename: './login/index.html'
		}),
		new HtmlWebpackPlugin({
			chunks: ['app'],
			template: './src/app/app.html',
			filename: './app/index.html'
		})
	]
};
