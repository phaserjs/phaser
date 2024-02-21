'use strict';

const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',

    context: `${__dirname}/../src/`,

    entry: {
        'phaser-facebook-instant-games': './phaser.js',
        'phaser-facebook-instant-games.min': './phaser.js'
    },

    output: {
        path: `${__dirname}/../dist/`,
        filename: '[name].js',
        library: 'Phaser',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },

    performance: { hints: false },

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
            "typeof WEBGL_RENDERER": JSON.stringify(true),
            "typeof EXPERIMENTAL": JSON.stringify(false),
            "typeof PLUGIN_3D": JSON.stringify(false),
            "typeof PLUGIN_CAMERA3D": JSON.stringify(false),
            "typeof PLUGIN_FBINSTANT": JSON.stringify(true),
            "typeof FEATURE_SOUND": JSON.stringify(true)
        })
    ]
};
