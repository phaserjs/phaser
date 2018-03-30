'use strict';

const webpack = require('webpack');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
    mode: 'development',

    context: `${__dirname}/src/`,

    entry: {phaser: './phaser.js'},

    output: {
        path: `${__dirname}/build/`,
        filename: '[name].js',
        library: 'Phaser',
        libraryTarget: 'umd',
        sourceMapFilename: '[file].map',
        devtoolModuleFilenameTemplate: 'webpack:///[resource-path]', // string
        devtoolFallbackModuleFilenameTemplate: 'webpack:///[resource-path]?[hash]', // string
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

    plugins: [
        new webpack.DefinePlugin({
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true)
        }),

        new WebpackShellPlugin({onBuildExit: 'node copy-to-examples.js'})
    ],

    devtool: 'source-map'
};
