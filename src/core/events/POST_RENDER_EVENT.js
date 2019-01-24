/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Game Post-Render Event.
 * 
 * This event is dispatched right at the end of the render process.
 * 
 * Every Scene will have rendered and been drawn to the canvas by the time this event is fired.
 * Use it for any last minute post-processing before the next game step begins.
 *
 * @event Phaser.Core.Events#POST_RENDER
 * 
 * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - A reference to the current renderer being used by the Game instance.
 */
module.exports = 'postrender';
