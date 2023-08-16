module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ['@babel/preset-env', { targets: { node: 'current' } }],
            '@babel/preset-react',
            '@babel/preset-flow',
            '@babel/preset-typescript',
            'module:metro-react-native-babel-preset'
        ],
        plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-syntax-dynamic-import',
            'babel-plugin-parameter-decorator',
            'babel-plugin-reactgenie'
        ]
    };
};
