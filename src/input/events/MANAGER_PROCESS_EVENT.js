/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Input Manager Process Event.
 * 
 * This internal event is dispatched by the Input Manager when not using the legacy queue system,
 * and it wants the Input Plugins to update themselves.
 *
 * @event Phaser.Input.Events#MANAGER_PROCESS
 * 
 * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
 */
module.exports = 'process';
