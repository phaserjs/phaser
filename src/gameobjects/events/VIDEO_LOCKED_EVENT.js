/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Locked Event.
 *
 * This event is dispatched when a Video was attempted to be played, but the browser prevented it
 * from doing so due to the Media Engagement Interaction policy.
 *
 * If you get this event you will need to wait for the user to interact with the browser before
 * the video will play. This is a browser security measure to prevent autoplaying videos with
 * audio. An interaction includes a mouse click, a touch, or a key press.
 *
 * Listen for it from a Video Game Object instance using `Video.on('locked', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_LOCKED
 * @type {string}
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which raised the event.
 */
module.exports = 'locked';
