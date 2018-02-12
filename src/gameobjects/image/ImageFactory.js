/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Image = require('./Image');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Image Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Image Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#image
 * @since 3.0.0
 *
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {string|integer} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * 
 * @return {Phaser.GameObjects.Image} The Game Object that was created.
 */
GameObjectFactory.register('image', function (x, y, key, frame)
{
    return this.displayList.add(new Image(this.scene, x, y, key, frame));
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
