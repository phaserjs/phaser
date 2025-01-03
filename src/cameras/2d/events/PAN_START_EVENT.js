/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Camera Pan Start Event.
 *
 * This event is dispatched by a Camera instance when the Pan Effect starts.
 *
 * Listen for it via either of the following:
 *
 * ```js
 * this.cameras.main.on('camerapanstart', () => {});
 * ```
 *
 * or use the constant, to avoid having to remember the correct event string:
 *
 * ```js
 * this.cameras.main.on(Phaser.Cameras.Scene2D.Events.PAN_START, () => {});
 * ```
 *
 * @event Phaser.Cameras.Scene2D.Events#PAN_START
 * @type {string}
 * @since 3.3.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that the effect began on.
 * @param {Phaser.Cameras.Scene2D.Effects.Pan} effect - A reference to the effect instance.
 * @param {number} duration - The duration of the effect.
 * @param {number} x - The destination scroll x coordinate.
 * @param {number} y - The destination scroll y coordinate.
 */
module.exports = 'camerapanstart';
