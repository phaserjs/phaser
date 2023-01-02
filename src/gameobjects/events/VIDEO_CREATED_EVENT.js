/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Created Event.
 *
 * This event is dispatched when the texture for a Video has been created. This happens
 * when enough of the video source has been loaded that the browser is able to render a
 * frame from it.
 *
 * Listen for it from a Video Game Object instance using `Video.on('created', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_CREATED
 * @type {string}
 * @since 3.20.0
 *
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which raised the event.
 * @param {number} width - The width of the video.
 * @param {number} height - The height of the video.
 */
module.exports = 'created';
