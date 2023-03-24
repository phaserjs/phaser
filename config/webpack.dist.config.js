'use strict';

const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = [
    {
        name: 'phaser-umd',
        mode: 'production',

        context: `${__dirname}/../src/`,

        entry: {
            phaser: './phaser.js',
            'phaser.min': './phaser.js',
            'phaser-arcade-physics': './phaser-arcade-physics.js',
            'phaser-arcade-physics.min': './phaser-arcade-physics.js',
            'phaser-ie9': './phaser-ie9.js',
            'phaser-ie9.min': './phaser-ie9.js'
        },

        output: {
            path: `${__dirname}/../dist/`,
            filename: '[name].js',
            globalObject: 'this',
            library: {
                name: 'Phaser',
                type: 'umd',
                umdNamedDefine: true,
            }
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
                "typeof WEBGL_DEBUG": JSON.stringify(false),
                "typeof EXPERIMENTAL": JSON.stringify(false),
                "typeof PLUGIN_3D": JSON.stringify(false),
                "typeof PLUGIN_CAMERA3D": JSON.stringify(false),
                "typeof PLUGIN_FBINSTANT": JSON.stringify(false),
                "typeof FEATURE_SOUND": JSON.stringify(true)
            }),

            new CleanWebpackPlugin()
        ]
    },
    {
        experiments: {
            outputModule: true,
        },

        name: 'phaser-esm',
        mode: 'production',
        dependencies: [ 'phaser-umd' ],

        context: `${__dirname}/../src/`,

        entry: {
            'phaser.esm': './phaser-esm.js',
            'phaser.esm.min': './phaser-esm.js'
        },

        output: {
            path: `${__dirname}/../dist/`,
            filename: '[name].js',
            library: {
                type: 'module'
            }
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
                        ecma: 6,
                        warnings: false
                    }
                })
            ]
        },

        plugins: [
            new webpack.DefinePlugin({
                "typeof CANVAS_RENDERER": JSON.stringify(true),
                "typeof WEBGL_RENDERER": JSON.stringify(true),
                "typeof WEBGL_DEBUG": JSON.stringify(false),
                "typeof EXPERIMENTAL": JSON.stringify(false),
                "typeof PLUGIN_3D": JSON.stringify(false),
                "typeof PLUGIN_CAMERA3D": JSON.stringify(false),
                "typeof PLUGIN_FBINSTANT": JSON.stringify(false),
                "typeof FEATURE_SOUND": JSON.stringify(true)
            })
        ]
    }
];
