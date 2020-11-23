/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Camera Fade In Start Event.
 * 
 * This event is dispatched by a Camera instance when the Fade In Effect starts.
 * 
 * Listen to it from a Camera instance using `Camera.on('camerafadeinstart', listener)`.
 *
 * @event Phaser.Cameras.Scene2D.Events#FADE_IN_START
 * @since 3.3.0
 * 
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that the effect began on.
 * @param {Phaser.Cameras.Scene2D.Effects.Fade} effect - A reference to the effect instance.
 * @param {number} duration - The duration of the effect.
 * @param {number} red - The red color channel value.
 * @param {number} green - The green color channel value.
 * @param {number} blue - The blue color channel value.
 */
module.exports = 'camerafadeinstart';
