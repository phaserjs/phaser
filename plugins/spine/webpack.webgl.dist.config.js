'use strict';

const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const exec = require('child_process').exec;
const RemovePlugin = require('remove-files-webpack-plugin');

module.exports = {
    mode: 'production',

    context: `${__dirname}/src/`,

    entry: {
        'SpineWebGLPlugin': './SpinePlugin.js',
        'SpineWebGLPlugin.min': './SpinePlugin.js'
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
                test: require.resolve('./src/runtimes/spine-webgl.js'),
                use: 'imports-loader?this=>window'
            },
            {
                test: require.resolve('./src/runtimes/spine-webgl.js'),
                use: 'exports-loader?spine'
            }
        ]
    },

    resolve: {
        alias: {
            'Spine': './runtimes/spine-webgl.js'
        }
    },

    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                include: /\.min\.js$/,
                parallel: true,
                sourceMap: false,
                uglifyOptions: {
                    compress: true,
                    ie8: false,
                    ecma: 5,
                    output: {comments: false},
                    warnings: false
                },
                warningsFilter: () => false
            })
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            "typeof CANVAS_RENDERER": JSON.stringify(false),
            "typeof WEBGL_RENDERER": JSON.stringify(true)
        }),
        new RemovePlugin({
            before: {
                before: {
                    root: './plugins/spine/dist/',
                    include: [ 'SpineWebGLPlugin.js', 'SpineWebGLPlugin.min.js' ]
                }
            }
        }),
        {
            apply: (compiler) => {
                compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
                    exec('node plugins/spine/copy-to-examples.js', (err, stdout, stderr) => {
                        if (stdout) process.stdout.write(stdout);
                        if (stderr) process.stderr.write(stderr);
                    });
                });
            }
        }
    ]
};
