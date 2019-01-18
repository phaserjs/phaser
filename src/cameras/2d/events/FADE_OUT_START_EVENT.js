/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Camera Fade Out Start Event.
 * 
 * This event is dispatched by a Camera instance when the Fade Out Effect starts.
 * 
 * Listen to it from a Camera instance using `Camera.on('camerafadeoutstart', listener)`.
 *
 * @event Phaser.Cameras.Scene2D.Events#FADE_OUT_START
 * 
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that the effect began on.
 * @param {Phaser.Cameras.Scene2D.Effects.Fade} effect - A reference to the effect instance.
 * @param {integer} duration - The duration of the effect.
 * @param {integer} red - The red color channel value.
 * @param {integer} green - The green color channel value.
 * @param {integer} blue - The blue color channel value.
 */
module.exports = 'camerafadeoutstart';
