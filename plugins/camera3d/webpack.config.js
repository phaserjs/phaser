'use strict';

const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const exec = require('child_process').exec;
const RemovePlugin = require('remove-files-webpack-plugin');

module.exports = {
    mode: 'production',

    context: `${__dirname}/src/`,

    entry: {
        camera3d: './Camera3DPlugin.js',
        'camera3d.min': './Camera3DPlugin.js'
    },

    output: {
        path: `${__dirname}/dist/`,
        filename: '[name].js',
        library: 'Camera3DPlugin',
        libraryTarget: 'var'
    },

    performance: { hints: false },

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
        new RemovePlugin({
            before: {
                root: './plugins/camera3d/dist/',
                include: [ 'camera3d.js', 'camera3d.min.js' ]
            }
        }),
        {
            apply: (compiler) => {
                compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
                    exec('node plugins/camera3d/copy-to-examples.js', (err, stdout, stderr) => {
                        if (stdout) process.stdout.write(stdout);
                        if (stderr) process.stderr.write(stderr);
                    });
                });
            }
        }
    ]
};
