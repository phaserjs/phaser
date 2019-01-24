/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Texture Remove Event.
 * 
 * This event is dispatched by the Texture Manager when a texture is removed from it.
 * 
 * Listen to this event from within a Scene using: `this.textures.on('removetexture', listener)`.
 * 
 * If you have any Game Objects still using the removed texture, they will start throwing
 * errors the next time they try to render. Be sure to clear all use of the texture in this event handler.
 *
 * @event Phaser.Textures.Events#REMOVE
 * 
 * @param {string} key - The key of the Texture that was removed from the Texture Manager.
 */
module.exports = 'removetexture';
