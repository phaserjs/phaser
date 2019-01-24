/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Camera Pan Start Event.
 * 
 * This event is dispatched by a Camera instance when the Pan Effect starts.
 *
 * @event Phaser.Cameras.Scene2D.Events#PAN_START
 * 
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that the effect began on.
 * @param {Phaser.Cameras.Scene2D.Effects.Pan} effect - A reference to the effect instance.
 * @param {integer} duration - The duration of the effect.
 * @param {number} x - The destination scroll x coordinate.
 * @param {number} y - The destination scroll y coordinate.
 */
module.exports = 'camerapanstart';
