/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @typedef {object} RendererConfig
 *
 * @property {boolean} clearBeforeRender - [description]
 * @property {boolean} pixelArt - [description]
 * @property {Phaser.Display.Color} backgroundColor - [description]
 * @property {number} resolution - [description]
 * @property {boolean} autoResize - [description]
 * @property {boolean} roundPixels - [description]
 */

/**
 * @namespace Phaser.Renderer
 */

module.exports = {

    Canvas: require('./canvas'),
    Snapshot: require('./snapshot'),
    WebGL: require('./webgl')

};
