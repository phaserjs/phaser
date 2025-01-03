/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Camera Fade Out Complete Event.
 *
 * This event is dispatched by a Camera instance when the Fade Out Effect completes.
 *
 * Listen to it from a Camera instance using `Camera.on('camerafadeoutcomplete', listener)`.
 *
 * @event Phaser.Cameras.Scene2D.Events#FADE_OUT_COMPLETE
 * @type {string}
 * @since 3.3.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that the effect began on.
 * @param {Phaser.Cameras.Scene2D.Effects.Fade} effect - A reference to the effect instance.
 */
module.exports = 'camerafadeoutcomplete';
