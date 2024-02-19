/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Stopped Event.
 *
 * This event is dispatched when a Video is stopped from playback via a call to the `Video.stop` method,
 * either directly via game code, or indirectly as the result of changing a video source or destroying it.
 *
 * Listen for it from a Video Game Object instance using `Video.on('stop', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_STOP
 * @type {string}
 * @since 3.20.0
 *
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which stopped playback.
 */
module.exports = 'stop';
