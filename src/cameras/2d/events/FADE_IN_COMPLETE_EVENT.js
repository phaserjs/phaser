/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Camera Fade In Complete Event.
 * 
 * This event is dispatched by a Camera instance when the Fade In Effect completes.
 * 
 * Listen to it from a Camera instance using `Camera.on('camerafadeincomplete', listener)`.
 *
 * @event Phaser.Cameras.Scene2D.Events#FADE_IN_COMPLETE
 * 
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that the effect began on.
 * @param {Phaser.Cameras.Scene2D.Effects.Fade} effect - A reference to the effect instance.
 */
module.exports = 'camerafadeincomplete';
