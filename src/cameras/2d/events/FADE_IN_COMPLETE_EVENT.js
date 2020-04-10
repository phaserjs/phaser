/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Camera Fade In Complete Event.
 * 
 * This event is dispatched by a Camera instance when the Fade In Effect completes.
 * 
 * Listen to it from a Camera instance using `Camera.on('camerafadeincomplete', listener)`.
 *
 * @event Phaser.Cameras.Scene2D.Events#FADE_IN_COMPLETE
 * @since 3.3.0
 * 
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that the effect began on.
 * @param {Phaser.Cameras.Scene2D.Effects.Fade} effect - A reference to the effect instance.
 */
module.exports = 'camerafadeincomplete';
