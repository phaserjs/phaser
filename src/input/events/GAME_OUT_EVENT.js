/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Input Plugin Game Out Event.
 * 
 * This event is dispatched by the Input Plugin if the active pointer leaves the game canvas and is now
 * outside of it, elsewhere on the web page.
 * 
 * Listen to this event from within a Scene using: `this.input.on('gameout', listener)`.
 *
 * @event Phaser.Input.Events#GAME_OUT
 * @since 3.16.1
 * 
 * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {(MouseEvent|TouchEvent)} event - The DOM Event that triggered the canvas out.
 */
module.exports = 'gameout';
