/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Lose WebGL Event.
 *
 * This event is dispatched by the WebGLRenderer when the WebGL context
 * is lost.
 *
 * Context can be lost for a variety of reasons, like leaving the browser tab.
 * The game canvas DOM object will dispatch `webglcontextlost`.
 * All WebGL resources get wiped, and the context is reset.
 *
 * While WebGL is lost, the game will continue to run, but all WebGL resources
 * are lost, and new ones cannot be created.
 *
 * Once the context is restored and the renderer has automatically restored
 * the state, the renderer will emit a `RESTORE_WEBGL` event. At that point,
 * it is safe to continue.
 *
 * @event Phaser.Renderer.Events#LOSE_WEBGL
 * @type {string}
 * @since 3.80.0
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - the renderer that owns the WebGL context
 */
module.exports = 'losewebgl';
