/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Group = require('./Group');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Group Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Group Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#group
 * @since 3.0.0
 *
 * @param {(array|object)} children - [description]
 * @param {object} [config] - [description]
 *
 * @return {Phaser.GameObjects.Group} The Game Object that was created.
 */
GameObjectFactory.register('group', function (children, config)
{
    if (typeof children === 'object' && config === undefined)
    {
        config = children;
        children = [];
    }

    return this.updateList.add(new Group(this.scene, children, config));
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
