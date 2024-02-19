/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Metadata Event.
 *
 * This event is dispatched when a Video has access to the metadata.
 *
 * Listen for it from a Video Game Object instance using `Video.on('metadata', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_METADATA
 * @type {string}
 * @since 3.80.0
 *
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which fired the event.
 * @param {DOMException|string} event - The native DOM event the browser raised during playback.
 */
module.exports = 'metadata';
