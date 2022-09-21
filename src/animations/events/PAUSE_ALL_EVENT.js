/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Pause All Animations Event.
 *
 * This event is dispatched when the global Animation Manager is told to pause.
 *
 * When this happens all current animations will stop updating, although it doesn't necessarily mean
 * that the game has paused as well.
 *
 * @event Phaser.Animations.Events#PAUSE_ALL
 * @type {string}
 * @since 3.0.0
 */
module.exports = 'pauseall';
