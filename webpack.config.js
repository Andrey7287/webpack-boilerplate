const webpack = require('webpack'),
	path = require('path'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	SpritesmithPlugin = require('webpack-spritesmith'),
	nodeEnv = process.env.NODE_ENV || 'development',
	isProd = nodeEnv === 'production',
	outputPath = 'js/',
	pages = ['index', 'inner', 'contacts'];

const extractCSS = new ExtractTextPlugin({
	filename: '../style.css',
	disable: !isProd,
	allChunks: true
});

const plugins = [
	new webpack.ProvidePlugin({
			$: 'jquery/dist/jquery.min'
	}),
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify(nodeEnv)
		}
	}),
	new SpritesmithPlugin({
		src: {
			cwd: path.resolve(__dirname, 'images/src'),
			glob: '*.png'
		},
		target: {
			image: path.resolve(__dirname, 'images/sprite.png'),
			css: path.resolve(__dirname, 'sass/tools/_sprite.scss')
		},
		apiOptions: {
			cssImageRef: '../images/sprite.png'
		}
	}),
	extractCSS
];

pages.forEach((val) => {

	plugins.push(
		new HtmlWebpackPlugin({
			template: `./frontend/${val}.ejs`,
			title: `${val}`,
			inject: true,
			filename: isProd ? `../${val}.html` : `${val}.html`,
			chunksSortMode: function (a, b) {  //alphabetical order
				if (a.names[0] > b.names[0]) {
					return -1;
				}
				if (a.names[0] < b.names[0]) {
					return 1;
				}
				return 0;
			}
		})
	);

});

if (isProd) {
	plugins.push(
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				conditionals: true,
				unused: true,
				comparisons: true,
				sequences: true,
				dead_code: true,
				evaluate: true,
				if_return: true,
				join_vars: true
			},
			output: {
				comments: false
			},
			sourceMap: true
		})
	);
} else {
	plugins.push(
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin()
	);
}

module.exports = {
	devtool: isProd ? 'cheap-module-source-map' : 'eval',
	entry: {
		bundle: ['./frontend/main']
	},
	output: {
		path: path.resolve(__dirname, outputPath),
		publicPath: isProd ? outputPath : '',
		filename: '[name].js',
		chunkFilename: 'chunk.[id].js'
	},
	module: {
		noParse: /jquery/,
		rules: [
			{
				test: /\.html$/,
				use: {
					loader: 'file-loader',
					query: {
						name: '[name].[ext]'
					}
				}
			}, {
				test: /\.scss$/,
				use: extractCSS.extract({
					use: [{
									loader: 'css-loader',
									options: {
										sourceMap: true
									}
                },{
									loader: 'postcss-loader',
									options: {
										sourceMap: true
									}
								},{
									loader: 'sass-loader',
									options: {
										sourceMap: true
									}
                }],
								fallback: 'style-loader'
				})
      }, {
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					cacheDirectory: true,
					presets: [
						[ 'es2015', { modules: false } ]
					]
				}

			}, {
				test: /\.(gif|png|jpg|jpeg\ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				use: [
					{
						loader: 'file-loader',
						query: {
							name: isProd ? '../images/[name].[ext]' : './images/[name].[ext]'
						}
					}
				]
			}
		],
	},
	resolve: {
		extensions: ['.js'],
		modules: [
			'node_modules',
			'spritesmith-generated'
		]
	},
	plugins: plugins,
	devServer: {
		open: true,
		historyApiFallback: true,
		port: 4000,
		hot: true,
		stats: {
			colors: true
		},
	}

};
