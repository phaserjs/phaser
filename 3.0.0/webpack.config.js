'use strict';

const webpack = require('webpack');

module.exports = {

    context: __dirname + '/src',

    entry: {
        phaser: './phaser.js'
    },

    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        library: 'Phaser',
        publicPath: '/lib'
    },

    devServer: {
        contentBase: __dirname + '/src'
    }

};
