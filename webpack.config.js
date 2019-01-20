const path = require('path');
const LicenseInfoWebpackPlugin = require('license-info-webpack-plugin').default;
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const SOURCE_DIR_NAME = 'app/frontend';
const OUTPUT_DIR_NAME = 'public/bundle';

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const plugins = [new VueLoaderPlugin(), new ManifestPlugin()];
  if (isProduction) {
    plugins.push(
      new CleanWebpackPlugin([OUTPUT_DIR_NAME]),
      new LicenseInfoWebpackPlugin({
        glob: '{LICENSE,license,License}*',
      })
    );
  }
  return {
    context: path.resolve(__dirname, SOURCE_DIR_NAME),
    entry: {
      index: './index.js',
    },
    output: {
      path: path.resolve(__dirname, OUTPUT_DIR_NAME),
      filename: isProduction ? '[name].[contentHash].js' : '[name].js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          include: path.resolve(__dirname, SOURCE_DIR_NAME),
          use: 'vue-loader',
        },
        {
          test: /\.sass|css$/,
          include: [
            path.resolve(__dirname, 'node_modules/bulma'),
            path.resolve(__dirname, SOURCE_DIR_NAME),
          ],
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.js$/,
          include: path.resolve(__dirname, SOURCE_DIR_NAME),
          use: 'babel-loader',
        },
      ],
    },
    plugins,
    optimization: isProduction
      ? {
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                output: {
                  comments: /^\**!|@preserve|@license|@cc_on/,
                },
              },
            }),
          ],
        }
      : {},
    devServer: {
      publicPath: '/bundle/',
      historyApiFallback: true,
      port: 8080,
    },
  };
};
