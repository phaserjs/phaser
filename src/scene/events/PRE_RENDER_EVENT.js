/**
 * @author       samme
 * @copyright    2021 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Systems Pre-Render Event.
 *
 * This event is dispatched by a Scene during the main game loop step.
 *
 * The event flow for a single step of a Scene is as follows:
 *
 * 1. [PRE_UPDATE]{@linkcode Phaser.Scenes.Events#event:PRE_UPDATE}
 * 2. [UPDATE]{@linkcode Phaser.Scenes.Events#event:UPDATE}
 * 3. The `Scene.update` method is called, if it exists
 * 4. [POST_UPDATE]{@linkcode Phaser.Scenes.Events#event:POST_UPDATE}
 * 5. [PRE_RENDER]{@linkcode Phaser.Scenes.Events#event:PRE_RENDER}
 * 6. [RENDER]{@linkcode Phaser.Scenes.Events#event:RENDER}
 *
 * Listen to this event from a Scene using `this.events.on('prerender', listener)`.
 *
 * A Scene will only render if it is visible.
 *
 * This event is dispatched after the Scene Display List is sorted and before the Scene is rendered.
 *
 * @event Phaser.Scenes.Events#PRE_RENDER
 * @type {string}
 * @since 3.53.0
 *
 * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - The renderer that rendered the Scene.
 */
module.exports = 'prerender';
