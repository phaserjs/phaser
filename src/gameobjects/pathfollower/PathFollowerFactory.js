/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObjectFactory = require('../GameObjectFactory');
var PathFollower = require('./PathFollower');

/**
 * Creates a new PathFollower Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the PathFollower Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#follower
 * @since 3.0.0
 *
 * @param {Phaser.Curves.Path} path - The Path this PathFollower is connected to.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {string|integer} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * 
 * @return {Phaser.GameObjects.PathFollower} The Game Object that was created.
 */
GameObjectFactory.register('follower', function (path, x, y, key, frame)
{
    var sprite = new PathFollower(this.scene, path, x, y, key, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    return sprite;
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
