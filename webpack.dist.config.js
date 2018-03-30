'use strict';

const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',

    context: `${__dirname}/src/`,

    entry: {
        phaser: './phaser.js',
        'phaser.min': './phaser.js',
        'phaser-arcade-physics': './phaser-arcade-physics.js',
        'phaser-arcade-physics.min': './phaser-arcade-physics.js'
    },

    output: {
        path: `${__dirname}/dist/`,
        filename: '[name].js',
        library: 'Phaser',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },

    module: {
        rules: [
            {
                test: [ /\.vert$/, /\.frag$/ ],
                use: 'raw-loader'
            }
        ]
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
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true)
        }),

        new CleanWebpackPlugin([ 'dist' ])
    ]
};
