/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
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
 */
module.exports = 'pauseall';
