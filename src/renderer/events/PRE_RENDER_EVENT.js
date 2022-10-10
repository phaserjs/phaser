/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Pre-Render Event.
 *
 * This event is dispatched by the Phaser Renderer. This happens right at the start of the render
 * process, after the context has been cleared, the scissors enabled (WebGL only) and everything has been
 * reset ready for the render.
 *
 * @event Phaser.Renderer.Events#PRE_RENDER
 * @type {string}
 * @since 3.50.0
 */
module.exports = 'prerender';
