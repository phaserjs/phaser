'use strict';

const webpack = require('webpack');
const exec = require('child_process').exec;
const RemovePlugin = require('remove-files-webpack-plugin');

module.exports = {
    mode: 'development',

    context: `${__dirname}/src/`,

    entry: {
        'SpineWebGLPluginDebug': './SpinePlugin.js'
    },

    output: {
        path: `${__dirname}/dist/`,
        filename: '[name].js',
        library: 'SpinePlugin',
        libraryTarget: 'window',
        sourceMapFilename: '[file].map',
        devtoolModuleFilenameTemplate: 'webpack:///[resource-path]', // string
        devtoolFallbackModuleFilenameTemplate: 'webpack:///[resource-path]?[hash]', // string
        umdNamedDefine: true
    },

    performance: { hints: false },

    module: {
        rules: [
            {
                test: require.resolve('./src/runtimes/spine-webgl.js'),
                loader: 'imports-loader',
                options: {
                    type: 'commonjs',
                    wrapper: 'window'
                }
            },
            {
                test: require.resolve('./src/runtimes/spine-webgl.js'),
                loader: 'exports-loader',
                options: {
                    type: 'commonjs',
                    exports: 'single spine'
                }
            }
        ]
    },

    resolve: {
        alias: {
            'SpineCanvas': './runtimes/spine-webgl.js',
            'SpineWebgl': './runtimes/spine-webgl.js'
        },
    },

    plugins: [
        new webpack.DefinePlugin({
            "typeof CANVAS_RENDERER": JSON.stringify(false),
            "typeof WEBGL_RENDERER": JSON.stringify(true)
        }),
        new RemovePlugin({
            before: {
                before: {
                    root: './plugins/spine4.1/dist/',
                    include: [ 'SpineWebGLPluginDebug.js', 'SpineWebGLPluginDebug.js.map' ]
                }
            }
        }),
        {
            apply: (compiler) => {
                compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
                    exec('node plugins/spine4.1/copy-to-examples.js', (err, stdout, stderr) => {
                        if (stdout) process.stdout.write(stdout);
                        if (stderr) process.stderr.write(stderr);
                    });
                });
            }
        }
    ],

    devtool: 'source-map'
};
