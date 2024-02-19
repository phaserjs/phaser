/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Camera Pre-Render Event.
 *
 * This event is dispatched by a Camera instance when it is about to render.
 * It is only dispatched if the Camera is rendering to a texture.
 *
 * Listen to it from a Camera instance using: `camera.on('prerender', listener)`.
 *
 * @event Phaser.Cameras.Scene2D.Events#PRE_RENDER
 * @type {string}
 * @since 3.0.0
 *
 * @param {Phaser.Cameras.Scene2D.BaseCamera} camera - The camera that is about to render to a texture.
 */
module.exports = 'prerender';
