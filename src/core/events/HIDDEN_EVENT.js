/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Hidden Event.
 * 
 * This event is dispatched by the Game Visibility Handler when the document in which the Game instance is embedded
 * enters a hidden state. Only browsers that support the Visibility API will cause this event to be emitted.
 * 
 * In most modern browsers, when the document enters a hidden state, the Request Animation Frame and setTimeout, which
 * control the main game loop, will automatically pause. There is no way to stop this from happening. It is something
 * your game should account for in its own code, should the pause be an issue (i.e. for multiplayer games)
 *
 * @event Phaser.Core.Events#HIDDEN
 * @since 3.0.0
 */
module.exports = 'hidden';
