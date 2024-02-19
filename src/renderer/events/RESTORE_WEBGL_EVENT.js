/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Restore WebGL Event.
 *
 * This event is dispatched by the WebGLRenderer when the WebGL context
 * is restored.
 *
 * It is dispatched after all WebGL resources have been recreated.
 * Most resources should come back automatically, but you will need to redraw
 * dynamic textures that were GPU bound.
 * Listen to this event to know when you can safely do that.
 *
 * Context can be lost for a variety of reasons, like leaving the browser tab.
 * The game canvas DOM object will dispatch `webglcontextlost`.
 * All WebGL resources get wiped, and the context is reset.
 *
 * Once the context is restored, the canvas will dispatch
 * `webglcontextrestored`. Phaser uses this to re-create necessary resources.
 * Please wait for Phaser to dispatch the `RESTORE_WEBGL` event before
 * re-creating any resources of your own.
 *
 * @event Phaser.Renderer.Events#RESTORE_WEBGL
 * @type {string}
 * @since 3.80.0
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - the renderer that owns the WebGL context
 */
module.exports = 'restorewebgl';
