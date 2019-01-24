/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Input Plugin Update Event.
 * 
 * This internal event is dispatched by the Input Plugin at the start of its `update` method.
 * This hook is designed specifically for input plugins, but can also be listened to from user-land code.
 *
 * @event Phaser.Input.Events#UPDATE
 * 
 * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
 */
module.exports = 'update';
