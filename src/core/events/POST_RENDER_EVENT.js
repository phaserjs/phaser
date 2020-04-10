/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * @since 3.0.0
 * 
 * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - A reference to the current renderer being used by the Game instance.
 */
module.exports = 'postrender';
