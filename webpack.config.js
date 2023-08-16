const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { ProgressPlugin } = require('webpack');

// const compileNodeModules = [
//     'react-native-vector-icons',
// ].map((moduleName) => path.resolve(appDirectory, `node_modules/${moduleName}`));
const appDirectory = path.resolve(__dirname, '../');
const ttfLoaderConfiguration = {
    test: /\.ttf$/,
    loader: 'url-loader', // or directly file-loader
    include: [
        path.resolve(appDirectory, 'node_modules/react-native-vector-icons')
    ]
};

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
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'images'
                            }
                        }
                    ]
                },
                ttfLoaderConfiguration
            ]
        },
        externals: {
            'react': 'react',
            'react-dom': 'react-dom',
            'react-native': 'react-native',
            '@react-navigation/stack': '@react-navigation/stack',
            '@expo/vector-icons': '@expo/vector-icons',
            'react-native-elements': 'react-native-elements',
            'react-native-vector-icons': 'react-native-vector-icons'
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
