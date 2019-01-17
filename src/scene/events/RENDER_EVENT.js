/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Scene Systems Render Event.
 * 
 * This event is dispatched by a Scene during the main game loop step.
 * 
 * The event flow for a single step of a Scene is as follows:
 * 
 * 1) [PRE_UPDATE]{Phaser.Scenes.Events#PRE_UPDATE}
 * 2) [UPDATE]{Phaser.Scenes.Events#UPDATE}
 * 3) The Scene.update method is called, if it exists
 * 4) [POST_UPDATE]{Phaser.Scenes.Events#POST_UPDATE}
 * 5) [RENDER]{Phaser.Scenes.Events#RENDER}
 * 
 * Listen to it from a Scene using `this.scene.events.on('render', listener)`.
 * 
 * A Scene will only render if it is visible and active.
 * By the time this event is dispatched, the Scene will have already been rendered.
 * 
 * @event Phaser.Scenes.Events#RENDER
 * 
 * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - The renderer that rendered the Scene.
 */
module.exports = 'render';
