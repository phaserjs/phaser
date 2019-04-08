/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var TileSprite = require('./TileSprite');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new TileSprite Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the TileSprite Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#tileSprite
 * @since 3.0.0
 *
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {integer} width - The width of the Game Object. If zero it will use the size of the texture frame.
 * @param {integer} height - The height of the Game Object. If zero it will use the size of the texture frame.
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 *
 * @return {Phaser.GameObjects.TileSprite} The Game Object that was created.
 */
GameObjectFactory.register('tileSprite', function (x, y, width, height, key, frame)
{
    return this.displayList.add(new TileSprite(this.scene, x, y, width, height, key, frame));
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
