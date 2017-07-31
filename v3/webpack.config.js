'use strict';

const webpack = require('webpack');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {

    context: `${__dirname}/src/`,

    entry: {
        phaser: './phaser.js'
    },

    output: {
        path: `${__dirname}/dist/`,
        filename: '[name].js',
        library: 'Phaser',
        libraryTarget: 'umd',
        sourceMapFilename: '[file].map',
        devtoolModuleFilenameTemplate: "webpack:///[resource-path]", // string
        devtoolFallbackModuleFilenameTemplate: "webpack:///[resource-path]?[hash]", // string
        umdNamedDefine: true,
    },

    plugins: [

        new WebpackShellPlugin({
            onBuildStart: 'node create-checksum.js',
            onBuildEnd: 'node copy-to-examples.js'
        })

    ],

    devtool: 'inline-source-map'

};
