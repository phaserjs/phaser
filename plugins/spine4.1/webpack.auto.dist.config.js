'use strict';

const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const exec = require('child_process').exec;
const RemovePlugin = require('remove-files-webpack-plugin');

module.exports = {
    mode: 'production',

    context: `${__dirname}/src/`,

    entry: {
        'SpinePlugin': './SpinePlugin.js',
        'SpinePlugin.min': './SpinePlugin.js'
    },

    output: {
        path: `${__dirname}/dist/`,
        filename: '[name].js',
        library: 'SpinePlugin',
        libraryTarget: 'window'
    },

    performance: { hints: false },

    module: {
        rules: [
            {
                test: require.resolve('./src/runtimes/spine-canvas.js'),
                loader: 'imports-loader',
                options: {
                    type: 'commonjs',
                    wrapper: 'window'
                }
            },
            {
                test: require.resolve('./src/runtimes/spine-canvas.js'),
                loader: 'exports-loader',
                options: {
                    type: 'commonjs',
                    exports: 'single spine'
                }
            },
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
            'SpineCanvas': './runtimes/spine-canvas.js',
            'SpineWebgl': './runtimes/spine-webgl.js'
        },
    },

    optimization: {
        minimizer: [
            new TerserPlugin({
                include: /\.min\.js$/,
                parallel: true,
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false
                    },
                    compress: true,
                    ie8: false,
                    ecma: 5,
                    warnings: false
                }
            })
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            "typeof CANVAS_RENDERER": JSON.stringify(true),
            "typeof WEBGL_RENDERER": JSON.stringify(true)
        }),
        new RemovePlugin({
            before: {
                root: './plugins/spine4.1/dist/',
                include: [ 'SpinePlugin.js', 'SpinePlugin.min.js' ]
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
    ]
};
