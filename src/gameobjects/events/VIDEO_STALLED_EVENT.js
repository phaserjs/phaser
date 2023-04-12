/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Stalled Event.
 *
 * This event is dispatched by a Video Game Object when the video playback stalls.
 *
 * This can happen if the video is buffering.
 *
 * If will fire for any of the following native DOM events:
 *
 * `stalled`
 * `suspend`
 * `waiting`
 *
 * Listen for it from a Video Game Object instance using `Video.on('stalled', listener)`.
 *
 * Note that being stalled isn't always a negative thing. A video can be stalled if it
 * has downloaded enough data in to its buffer to not need to download any more until
 * the current batch of frames have rendered.
 *
 * @event Phaser.GameObjects.Events#VIDEO_STALLED
 * @type {string}
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which threw the error.
 * @param {Event} event - The native DOM event the browser raised during playback.
 */
module.exports = 'stalled';
