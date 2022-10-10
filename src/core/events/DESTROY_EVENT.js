/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Destroy Event.
 *
 * This event is dispatched when the game instance has been told to destroy itself.
 * Lots of internal systems listen to this event in order to clear themselves out.
 * Custom plugins and game code should also do the same.
 *
 * @event Phaser.Core.Events#DESTROY
 * @type {string}
 * @since 3.0.0
 */
module.exports = 'destroy';
