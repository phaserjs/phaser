/**
 * @author       samme
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Texture Remove Key Event.
 *
 * This event is dispatched by the Texture Manager when a texture with the given key is removed from it.
 *
 * Listen to this event from within a Scene using: `this.textures.on('removetexture-key', listener)`.
 *
 * If you have any Game Objects still using the removed texture, they will start throwing
 * errors the next time they try to render. Be sure to clear all use of the texture in this event handler.
 *
 * @event Phaser.Textures.Events#REMOVE_KEY
 * @type {string}
 * @since 3.60.0
 */
module.exports = 'removetexture-';
