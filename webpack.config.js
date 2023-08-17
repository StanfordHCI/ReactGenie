const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { ProgressPlugin } = require('webpack');

module.exports = function (env, argv) {
    return {
        name: 'reactgenie-lib',
        mode: argv.mode,
        entry: path.resolve(__dirname, 'src/index.ts'),

        output: {
            filename: 'index.js',
            library: '$',
            libraryTarget: 'umd',
            path: path.resolve(__dirname, 'dist')
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.(js|ts)x?$/,
                    exclude: /node_modules/,
                    use: ['babel-loader', 'ts-loader']
                },

                {
                    test: /\.(png|jpg|gif)$/i,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'images'
                            }
                        }
                    ]
                }
            ]
        },
        externals: {
            'react': 'react',
            'react-dom': 'react-dom',
            'react-native': 'react-native',
            '@react-navigation/stack': '@react-navigation/stack',

            'reflect-metadata': 'reflect-metadata',
            'react-redux': 'react-redux',
            '@react-native-material/core': '@react-native-material/core',
            '@react-navigation/native': '@react-navigation/native',
            'web-speech-cognitive-services': 'web-speech-cognitive-services',
            'reactgenie-dsl': 'reactgenie-dsl'
        },
        resolve: {
            alias: {
                '@root': path.resolve(__dirname, 'src')
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        plugins: [
            new ProgressPlugin(),
            new ESLintPlugin({
                extensions: ['.js', '.jsx', '.ts', '.tsx']
            }),
            new CleanWebpackPlugin()
        ]
    };
};
