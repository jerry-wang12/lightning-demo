const path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    webpack = require('webpack');

const config = {
    target: 'web',
    mode: 'production',
    entry: path.resolve(__dirname, '../../src/index.ts'),
    output: {
        filename: './scripts/[name]_[contenthash].js',
        chunkFilename: './scripts/[name]_[chunkhash].js',
        path: path.resolve(__dirname, '../../dist')
    },
    resolve: {
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.resolve(__dirname, '../../tsconfig.json')
            })
        ],
        alias: {
            'lwc': path.resolve(__dirname, '../../vendor/engine/engine.js')
        }
    },
    module: {
        rules: [
            {
                test: /\.(tsx|ts)$/,
                use: ['babel-loader', 'ts-loader']
            },
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.(gif|png|jpe?g|svg|woff|woff2)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: './assets/fonts/[name]_[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    devtool: '#cheap-module-eval-source-map',
    // devServer: {
    //     port: 8000,
    //     host: '0.0.0.0',
    //     overlay: {
    //         errors: true
    //     },
    //     hot: true
    // }

    plugins: [
        new HtmlWebpackPlugin(),

        new ExtractTextPlugin({
            filename: './assets/styles/[name]_[hash:8].css'
        }),

        new webpack.optimize.RuntimeChunkPlugin({
            name: 'manifest'
        })

        // new webpack.optimize.SplitChunksPlugin({
        //     chunks: 'all',
        //     maxSize: 300000
        // })
    ]
};

module.exports = config;
