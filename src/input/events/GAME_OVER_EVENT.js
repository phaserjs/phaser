/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Input Plugin Game Over Event.
 * 
 * This event is dispatched by the Input Plugin if the active pointer enters the game canvas and is now
 * over of it, having previously been elsewhere on the web page.
 * 
 * Listen to this event from within a Scene using: `this.input.on('gameover', listener)`.
 *
 * @event Phaser.Input.Events#GAME_OVER
 * 
 * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {(MouseEvent|TouchEvent)} event - The DOM Event that triggered the canvas over.
 */
module.exports = 'gameover';
