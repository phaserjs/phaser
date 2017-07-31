'use strict';

const webpack = require('webpack');
const WebpackShellPlugin = require('webpack-shell-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

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
        umdNamedDefine: true
    },

    plugins: [

        new UglifyJSPlugin({
            parallel: true,
            sourceMap: true,
            compress: true,
            comments: false,
            uglifyOptions: {
                ie8: false,
                ecma: 5,
                warnings: false
            },
            warningsFilter: (src) => false
        }),

        new WebpackShellPlugin({
            onBuildStart: 'node create-checksum.js'
        })

    ]

};
