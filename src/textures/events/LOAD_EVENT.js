/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Texture Load Event.
 * 
 * This event is dispatched by the Texture Manager when a texture has finished loading on it.
 * This only happens for base64 encoded textures. All other texture types are loaded via the Loader Plugin.
 * 
 * Listen to this event from within a Scene using: `this.textures.on('onload', listener)`.
 * 
 * This event is dispatched after the [ADD]{@linkcode Phaser.Textures.Events#event:ADD} event.
 *
 * @event Phaser.Textures.Events#LOAD
 * 
 * @param {string} key - The key of the Texture that was loaded by the Texture Manager.
 * @param {Phaser.Textures.Texture} texture - A reference to the Texture that was loaded by the Texture Manager.
 */
module.exports = 'onload';
