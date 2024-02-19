/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Texture Ready Event.
 *
 * This event is dispatched by a Video Game Object when it has finished creating its texture.
 *
 * This happens when the video has finished loading enough data for its first frame.
 *
 * If you wish to use the Video texture elsewhere in your game, such as as a Sprite texture,
 * then you should listen for this event first, before creating the Sprites that use it.
 *
 * Listen for it from a Video Game Object instance using `Video.on('textureready', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_TEXTURE
 * @type {string}
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.Video} video - The Video Game Object that emitted the event.
 * @param {Phaser.Textures.Texture} texture - The Texture that was created.
 */
module.exports = 'textureready';
