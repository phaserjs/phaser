/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Loop Event.
 * 
 * This event is dispatched when a Video that is currently playing has looped. This only
 * happens if the `loop` parameter was specified, or the `setLoop` method was called,
 * and if the video has a fixed duration. Video streams, for example, cannot loop, as
 * they have no duration.
 * 
 * Looping is based on the result of the Video `timeupdate` event. This event is not
 * frame-accurate, due to the way browsers work, so please do not rely on this loop
 * event to be time or frame precise.
 * 
 * Listen for it from a Video Game Object instance using `Video.on('loop', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_LOOP
 * @since 3.20.0
 * 
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which has looped.
 */
module.exports = 'loop';
