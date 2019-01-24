/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Game Pre-Step Event.
 * 
 * This event is dispatched before the main Game Step starts. By this point in the game cycle none of the Scene updates have yet happened.
 * Hook into it from plugins or systems that need to update before the Scene Manager does.
 *
 * @event Phaser.Core.Events#PRE_STEP
 * 
 * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
 */
module.exports = 'prestep';
