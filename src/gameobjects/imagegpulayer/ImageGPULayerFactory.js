/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ImageGPULayer = require('./ImageGPULayer');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new ImageGPULayer Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the ImageGPULayer Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#imagegpulayer
 * @since 3.0.0
 *
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 *
 * @return {Phaser.GameObjects.ImageGPULayer} The Game Object that was created.
 */
GameObjectFactory.register('imageGPULayer', function (texture)
{
    return this.displayList.add(new ImageGPULayer(this.scene, texture));
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
