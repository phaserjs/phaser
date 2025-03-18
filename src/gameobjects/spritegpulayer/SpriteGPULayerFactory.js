/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SpriteGPULayer = require('./SpriteGPULayer');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new SpriteGPULayer Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the SpriteGPULayer Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#spriteGPULayer
 * @since 4.0.0
 *
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {number} [size] - The number of members the SpriteGPULayer will accommodate. Default 1.
 *
 * @return {Phaser.GameObjects.SpriteGPULayer} The Game Object that was created.
 */
GameObjectFactory.register('spriteGPULayer', function (texture, size)
{
    return this.displayList.add(new SpriteGPULayer(this.scene, texture, size));
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
