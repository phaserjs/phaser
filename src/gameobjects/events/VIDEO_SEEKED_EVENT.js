/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Seeked Event.
 *
 * This event is dispatched when a Video completes seeking to a new point in its timeline.
 *
 * Listen for it from a Video Game Object instance using `Video.on('seeked', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_SEEKED
 * @type {string}
 * @since 3.20.0
 *
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which completed seeking.
 */
module.exports = 'seeked';
