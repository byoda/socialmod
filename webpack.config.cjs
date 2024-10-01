const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    // Multiple entry points: https://github.com/webpack/docs/wiki/configuration#outputfilename
    entry: {
        socialmod: './src/X/block.ts',
        jwt_grabber: './src/jwt/jwt_grabber.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
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