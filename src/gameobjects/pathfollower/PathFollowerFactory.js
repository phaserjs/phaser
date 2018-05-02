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
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {Phaser.Curves.Path} path - The Path this PathFollower is connected to.
 * @param {Phaser.GameObjects.GameObject[]} [children] - An optional array of Game Objects to add to this Container.
 *
 * @return {Phaser.GameObjects.PathFollower} The Game Object that was created.
 */
GameObjectFactory.register('follower', function (x, y, path, children)
{
    var container = new PathFollower(this.scene, x, y, path, children);

    this.displayList.add(container);
    this.updateList.add(container);

    return container;
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
