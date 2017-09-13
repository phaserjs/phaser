'use strict';

const webpack = require('webpack');
const WebpackShellPlugin = require('webpack-shell-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {

    context: `${__dirname}/src/`,

    entry: {
        phaser: './phaser.js',
        'phaser.min': './phaser.js'
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
            include: /\.min\.js$/,
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

// new webpack.DefinePlugin({
//   PRODUCTION: JSON.stringify(true),
//   VERSION: JSON.stringify("5fa3b9"),
//   BROWSER_SUPPORTS_HTML5: true,
//   TWO: "1+1",
//   "typeof window": JSON.stringify("object")
// })

};
