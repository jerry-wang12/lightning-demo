const path = require('path'),
    TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const config = {
    target: 'node',
    mode: 'production',
    entry: path.resolve(__dirname, '../../src/index.ts'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../../dist')
    },
    resolve: {
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.resolve(__dirname, '../../tsconfig.json')
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.(tsx|ts)$/,
                use: ['babel-loader', 'ts-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: '[name].urloader.[ext]'
                        }
                    }
                ]
            }
        ]
    },
    devtool: '#cheap-module-eval-source-map'
    // devServer: {
    //     port: 8000,
    //     host: '0.0.0.0',
    //     overlay: {
    //         errors: true
    //     },
    //     hot: true
    // }
};

module.exports = config;
