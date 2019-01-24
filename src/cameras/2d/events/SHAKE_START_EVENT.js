/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Camera Shake Start Event.
 * 
 * This event is dispatched by a Camera instance when the Shake Effect starts.
 *
 * @event Phaser.Cameras.Scene2D.Events#SHAKE_START
 * 
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that the effect began on.
 * @param {Phaser.Cameras.Scene2D.Effects.Shake} effect - A reference to the effect instance.
 * @param {integer} duration - The duration of the effect.
 * @param {number} intensity - The intensity of the effect.
 */
module.exports = 'camerashakestart';
