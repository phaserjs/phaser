/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Unlocked Event.
 *
 * This event is dispatched when a Video that was prevented from playback due to the browsers
 * Media Engagement Interaction policy, is unlocked by a user gesture.
 *
 * Listen for it from a Video Game Object instance using `Video.on('unlocked', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_UNLOCKED
 * @type {string}
 * @since 3.20.0
 *
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which raised the event.
 */
module.exports = 'unlocked';
