/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Camera Flash Start Event.
 *
 * This event is dispatched by a Camera instance when the Flash Effect starts.
 *
 * Listen for it via either of the following:
 *
 * ```js
 * this.cameras.main.on('cameraflashstart', () => {});
 * ```
 *
 * or use the constant, to avoid having to remember the correct event string:
 *
 * ```js
 * this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FLASH_START, () => {});
 * ```
 *
 * @event Phaser.Cameras.Scene2D.Events#FLASH_START
 * @type {string}
 * @since 3.3.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that the effect began on.
 * @param {Phaser.Cameras.Scene2D.Effects.Flash} effect - A reference to the effect instance.
 * @param {number} duration - The duration of the effect.
 * @param {number} red - The red color channel value.
 * @param {number} green - The green color channel value.
 * @param {number} blue - The blue color channel value.
 */
module.exports = 'cameraflashstart';
