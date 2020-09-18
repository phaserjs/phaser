/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Camera Rotate Start Event.
 * 
 * This event is dispatched by a Camera instance when the Rotate Effect starts.
 *
 * @event Phaser.Cameras.Scene2D.Events#ROTATE_START
 * @since 3.23.0
 * 
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that the effect began on.
 * @param {Phaser.Cameras.Scene2D.Effects.RotateTo} effect - A reference to the effect instance.
 * @param {integer} duration - The duration of the effect.
 * @param {number} destination - The destination value.
 */
module.exports = 'camerarotatestart';
