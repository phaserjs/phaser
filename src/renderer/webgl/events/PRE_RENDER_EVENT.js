/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Pre-Render Event.
 *
 * This event is dispatched by the WebGL Renderer. This happens right at the start of the render
 * process, after the context has been cleared, the scissors enabled and everything has been
 * reset ready for the render.
 *
 * @event Phaser.Renderer.WebGL.Events#PRE_RENDER
 * @since 3.50.0
 */
module.exports = 'prerender';
