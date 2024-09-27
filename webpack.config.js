const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    entry: './X/block.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'socialmod.js',
    },
    mode: 'production',
    devtool: 'source-map',
    experiments: {
        outputModule: true,
    },
    plugins: [
        // new ForkTsCheckerWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    }
                ]
            }
        // https://webpack.js.org/loaders/babel-loader/#root
        //  {
        //      test: /.m?js$/,
        //      loader: 'babel-loader',
        //      exclude: /node_modules/,
        //  }
        ],
    },
};