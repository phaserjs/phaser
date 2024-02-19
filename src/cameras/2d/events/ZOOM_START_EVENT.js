/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Camera Zoom Start Event.
 *
 * This event is dispatched by a Camera instance when the Zoom Effect starts.
 *
 * Listen for it via either of the following:
 *
 * ```js
 * this.cameras.main.on('camerazoomstart', () => {});
 * ```
 *
 * or use the constant, to avoid having to remember the correct event string:
 *
 * ```js
 * this.cameras.main.on(Phaser.Cameras.Scene2D.Events.ZOOM_START, () => {});
 * ```
 *
 * @event Phaser.Cameras.Scene2D.Events#ZOOM_START
 * @type {string}
 * @since 3.3.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that the effect began on.
 * @param {Phaser.Cameras.Scene2D.Effects.Zoom} effect - A reference to the effect instance.
 * @param {number} duration - The duration of the effect.
 * @param {number} zoom - The destination zoom value.
 */
module.exports = 'camerazoomstart';
