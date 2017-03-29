const webpack = require('webpack'),
			path = require('path'),
			ExtractTextPlugin = require('extract-text-webpack-plugin'),
			HtmlWebpackPlugin = require('html-webpack-plugin'),
			SpritesmithPlugin = require('webpack-spritesmith');
			nodeEnv = process.env.NODE_ENV || 'development',
			isProd = nodeEnv === 'production',
			pages = ['index', 'inner', 'contacts'];

const extractCSS = new ExtractTextPlugin({
	filename: '../style.css',
	disable: false,
	allChunks: true
});

const plugins = [
	new webpack.optimize.CommonsChunkPlugin({
		name: 'vendor',
		minChunks: Infinity,
		filename: 'vendor.bundle.js'
	}),
	new webpack.DefinePlugin({
		'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
	}),
	new webpack.ProvidePlugin({
		$: 'jquery/dist/jquery.min'
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
	})
];

pages.forEach((val)=>{

	plugins.push(
		new HtmlWebpackPlugin({
			template: `./frontend/${val}.ejs`,
			title: `${val}`,
			inject: true,
			filename: isProd ? `../${val}.html` : `${val}.html`
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
				join_vars: true,
			},
			output: {
				comments: false
			},
		}),
		extractCSS
	);
} else {
	plugins.push(
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin()
	);
}

module.exports = {
	devtool: isProd ? 'source-map' : 'cheap-module-source-map',
	entry: {
		js: ['./frontend/main']
	},
	output: {
		path: isProd ? './js' : path.resolve(__dirname, '/js'),
		filename: 'bundle.js',
		publicPath: isProd ? './js/' : ''
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
			},
			{
				test: /\.scss$/,
				loaders: isProd ?
					extractCSS.extract({
						fallbackLoader: 'style-loader',
						loader: ['css-loader', 'sass-loader'],
					}) :
					['style-loader',
					 'css-loader',{
						loader: 'postcss-loader',
							options: {
								plugins: function () {
									return [
										require('autoprefixer')
									];
								}
							}
						},
					 'sass-loader'
					]
			},{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						query: {
							cacheDirectory: true
						}
					}
				]
			},
			{
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
		port: 3000,
		hot: true,
		stats: { colors: true },
	}

};
