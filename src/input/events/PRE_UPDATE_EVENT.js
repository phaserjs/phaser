/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Input Plugin Pre-Update Event.
 *
 * This internal event is dispatched by the Input Plugin at the start of its `preUpdate` method.
 * This hook is designed specifically for input plugins, but can also be listened to from user-land code.
 *
 * @event Phaser.Input.Events#PRE_UPDATE
 * @type {string}
 * @since 3.0.0
 */
module.exports = 'preupdate';
