/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @callback SnapshotCallback
 *
 * @param {HTMLImageElement} snapshot - [description]
 */

/**
 * @namespace Phaser.Renderer.Snapshot
 */

module.exports = {

    Canvas: require('./CanvasSnapshot'),
    WebGL: require('./WebGLSnapshot')

};
