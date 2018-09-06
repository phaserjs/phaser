/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Sprite3D = require('./Sprite3D');
var GameObjectFactory = require('../../../../src/gameobjects/GameObjectFactory');

/**
 * Creates a new Sprite3D Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Sprite3D Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#sprite3D
 * @since 3.0.0
 *
 * @param {number} x - The horizontal position of this Game Object.
 * @param {number} y - The vertical position of this Game Object.
 * @param {number} z - The z position of this Game Object.
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 *
 * @return {Phaser.GameObjects.Sprite3D} The Game Object that was created.
 */
GameObjectFactory.register('sprite3D', function (x, y, z, key, frame)
{
    var sprite = new Sprite3D(this.scene, x, y, z, key, frame);

    this.displayList.add(sprite.gameObject);
    this.updateList.add(sprite.gameObject);

    return sprite;
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
