const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const path = require('path');

const htmlPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html',
});

module.exports = (env, argv) => {
  // source map that allows errors to report source file of error 
  let devToolEnabled = env === 'dev' ? 'source-map' : '';

  return {
    entry: {
      main: path.resolve(__dirname, 'src/index.js'),
      EPPService: path.resolve(
        __dirname,
        'src/app/view/MainView.jsx'
      )
    },
    output: {
      filename: '[name].[hash].js',
      path: path.resolve(__dirname, 'dist'),
    },
    devtool: devToolEnabled,
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0, //made response time slower? but scales better
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },

      },
      minimize: env !== 'dev' ? true : false,
      minimizer: [new TerserPlugin()]
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          options: {
            presets: ['env', 'react', 'stage-2'],
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        { test: /\.(woff|woff2|eot|ttf|otf)$/, use: [ 'file-loader' ] },
        {
          test: /\.(png|jpg|svg)$/,
          loader: 'url-loader'
        }
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    plugins: [
      htmlPlugin,
      // new MiniCssExtractPlugin({
      //   filename: '[name].css',
      // }),
      new CleanWebpackPlugin()
    ],
    devServer: {
      contentBase: './src',
      compress: true,
      port: 8080,
      historyApiFallback: true,
    },
  };
};
