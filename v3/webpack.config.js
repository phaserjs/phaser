'use strict';

const webpack = require('webpack');

module.exports = {

    context: './src',

    entry: {
        phaser: './phaser.js'
    },

    output: {
        path: './dist',
        filename: '[name].js',
        library: 'Phaser',
        publicPath: '/lib'
    },

    devServer: {
        contentBase: '/src'
    }

};
