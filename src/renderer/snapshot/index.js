/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @callback SnapshotCallback
 *
 * @param {(Phaser.Display.Color|HTMLImageElement)} snapshot - Either a Color object if a single pixel is being grabbed, or a new Image which contains a snapshot of the canvas contents.
 */

/**
 * @typedef {object} SnapshotState
 *
 * @property {SnapshotCallback} callback - The function to call after the snapshot is taken.
 * @property {string} [type='image/png'] - The format of the image to create, usually `image/png` or `image/jpeg`.
 * @property {number} [encoderOptions=0.92] - The image quality, between 0 and 1. Used for image formats with lossy compression, such as `image/jpeg`.
 * @property {integer} [x=0] - The x coordinate to start the snapshot from.
 * @property {integer} [y=0] - The y coordinate to start the snapshot from.
 * @property {integer} [width] - The width of the snapshot.
 * @property {integer} [height] - The height of the snapshot.
 * @property {boolean} [getPixel=false] - Is this a snapshot to get a single pixel, or an area?
 */

/**
 * @namespace Phaser.Renderer.Snapshot
 */

module.exports = {

    Canvas: require('./CanvasSnapshot'),
    WebGL: require('./WebGLSnapshot')

};
