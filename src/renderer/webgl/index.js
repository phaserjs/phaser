/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @namespace Phaser.Renderer.WebGL
 */

module.exports = {

    Utils: require('./Utils'),
    WebGLPipeline: require('./WebGLPipeline'),
    WebGLRenderer: require('./WebGLRenderer'),
    Pipelines: require('./pipelines'),

    // Constants
    BYTE: 0,
    SHORT: 1,
    UNSIGNED_BYTE: 2,
    UNSIGNED_SHORT: 3,
    FLOAT: 4

};
