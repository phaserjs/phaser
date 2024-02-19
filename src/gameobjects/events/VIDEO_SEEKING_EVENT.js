/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Seeking Event.
 *
 * This event is dispatched when a Video _begins_ seeking to a new point in its timeline.
 * When the seek is complete, it will dispatch the `VIDEO_SEEKED` event to conclude.
 *
 * Listen for it from a Video Game Object instance using `Video.on('seeking', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_SEEKING
 * @type {string}
 * @since 3.20.0
 *
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which started seeking.
 */
module.exports = 'seeking';
