/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Camera Fade Out Complete Event.
 * 
 * This event is dispatched by a Camera instance when the Fade Out Effect completes.
 * 
 * Listen to it from a Camera instance using `Camera.on('camerafadeoutcomplete', listener)`.
 *
 * @event Phaser.Cameras.Scene2D.Events#FADE_OUT_COMPLETE
 * 
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that the effect began on.
 * @param {Phaser.Cameras.Scene2D.Effects.Fade} effect - A reference to the effect instance.
 */
module.exports = 'camerafadeoutcomplete';
