/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Pre-Render Event.
 *
 * This event is dispatched immediately before any of the Scenes have started to render.
 *
 * The renderer will already have been initialized this frame, clearing itself and preparing to receive the Scenes for rendering, but it won't have actually drawn anything yet.
 *
 * @event Phaser.Core.Events#PRE_RENDER
 * @type {string}
 * @since 3.0.0
 *
 * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - A reference to the current renderer being used by the Game instance.
 */
module.exports = 'prerender';
