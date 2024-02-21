'use strict';

const webpack = require('webpack');
const exec = require('child_process').exec;

module.exports = {
    mode: 'development',

    context: `${__dirname}/../src/`,

    entry: {
        phaser: './phaser.js'
    },

    output: {
        path: `${__dirname}/../build/`,
        filename: 'phaser-facebook-instant-games.js',
        library: 'Phaser',
        libraryTarget: 'umd',
        sourceMapFilename: '[file].map',
        devtoolModuleFilenameTemplate: 'webpack:///[resource-path]', // string
        devtoolFallbackModuleFilenameTemplate: 'webpack:///[resource-path]?[hash]', // string
        umdNamedDefine: true
    },

    performance: { hints: false },

    plugins: [
        new webpack.DefinePlugin({
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true),
            EXPERIMENTAL: JSON.stringify(false),
            PLUGIN_3D: JSON.stringify(false),
            PLUGIN_CAMERA3D: JSON.stringify(false),
            PLUGIN_FBINSTANT: JSON.stringify(true),
            FEATURE_SOUND: JSON.stringify(true)
        }),
        {
            apply: (compiler) => {
                compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
                    exec('node scripts/copy-to-examples-fb.js', (err, stdout, stderr) => {
                        if (stdout) process.stdout.write(stdout);
                        if (stderr) process.stderr.write(stderr);
                    });
                });
            }
        }
    ],

    devtool: 'source-map'
};
