/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Game Post-Step Event.
 * 
 * This event is dispatched after the Scene Manager has updated.
 * Hook into it from plugins or systems that need to do things before the render starts.
 *
 * @event Phaser.Core.Events#POST_STEP
 * 
 * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
 */
module.exports = 'poststep';
