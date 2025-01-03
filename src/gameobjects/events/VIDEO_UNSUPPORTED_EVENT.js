/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Unsupported Event.
 *
 * This event is dispatched by a Video Game Object if the media source
 * (which may be specified as a MediaStream, MediaSource, Blob, or File,
 * for example) doesn't represent a supported media format.
 *
 * Listen for it from a Video Game Object instance using `Video.on('unsupported', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_UNSUPPORTED
 * @type {string}
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which started playback.
 * @param {DOMException|string} event - The native DOM event the browser raised during playback.
 */
module.exports = 'unsupported';
