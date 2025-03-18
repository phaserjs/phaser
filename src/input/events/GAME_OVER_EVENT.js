/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * @type {string}
 * @since 3.16.1
 *
 * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {(MouseEvent|TouchEvent)} event - The DOM Event that triggered the canvas over.
 */
module.exports = 'gameover';
