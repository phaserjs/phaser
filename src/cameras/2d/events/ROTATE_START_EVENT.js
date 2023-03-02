/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Camera Rotate Start Event.
 *
 * This event is dispatched by a Camera instance when the Rotate Effect starts.
 *
 * Listen for it via either of the following:
 *
 * ```js
 * this.cameras.main.on('camerarotatestart', () => {});
 * ```
 *
 * or use the constant, to avoid having to remember the correct event string:
 *
 * ```js
 * this.cameras.main.on(Phaser.Cameras.Scene2D.Events.ROTATE_START, () => {});
 * ```
 *
 * @event Phaser.Cameras.Scene2D.Events#ROTATE_START
 * @type {string}
 * @since 3.23.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that the effect began on.
 * @param {Phaser.Cameras.Scene2D.Effects.RotateTo} effect - A reference to the effect instance.
 * @param {number} duration - The duration of the effect.
 * @param {number} destination - The destination value.
 */
module.exports = 'camerarotatestart';
