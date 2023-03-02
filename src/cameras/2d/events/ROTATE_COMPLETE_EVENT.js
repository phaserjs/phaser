/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Camera Rotate Complete Event.
 *
 * This event is dispatched by a Camera instance when the Rotate Effect completes.
 *
 * Listen for it via either of the following:
 *
 * ```js
 * this.cameras.main.on('camerarotatecomplete', () => {});
 * ```
 *
 * or use the constant, to avoid having to remember the correct event string:
 *
 * ```js
 * this.cameras.main.on(Phaser.Cameras.Scene2D.Events.ROTATE_COMPLETE, () => {});
 * ```
 *
 * @event Phaser.Cameras.Scene2D.Events#ROTATE_COMPLETE
 * @type {string}
 * @since 3.23.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that the effect began on.
 * @param {Phaser.Cameras.Scene2D.Effects.RotateTo} effect - A reference to the effect instance.
 */
module.exports = 'camerarotatecomplete';
