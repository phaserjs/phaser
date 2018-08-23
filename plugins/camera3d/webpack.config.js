'use strict';

const webpack = require('webpack');
const exec = require('child_process').exec;

module.exports = {
    mode: 'development',

    context: `${__dirname}/src/`,

    entry: {
        camera3d: './index.js'
    },

    output: {
        path: `${__dirname}/build/`,
        filename: '[name].js',
        library: 'PhaserCamera3DPlugin',
        libraryTarget: 'umd',
        umdNamedDefine: true
    }
};
