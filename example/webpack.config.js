const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
    return await createExpoWebpackConfigAsync(
        {
            ...env,
            babel: {
                dangerouslyAddModulePathsToTranspile: [
                    'reactgenie-dsl',
                    'reactgenie-lib'
                ]
            }
        },
        argv
    );
};