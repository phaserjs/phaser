/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Layer3D = require('./Layer3D');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Layer3D Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Layer3D Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#layer3d
 * @webglOnly
 * @since 3.50.0
 *
 * @param {number} [x] - The horizontal position of this Game Object in the world.
 * @param {number} [y] - The vertical position of this Game Object in the world.
 *
 * @return {Phaser.GameObjects.Layer3D} The Game Object that was created.
 */
if (typeof WEBGL_RENDERER)
{
    GameObjectFactory.register('layer3d', function (x, y)
    {
        return this.displayList.add(new Layer3D(this.scene, x, y));
    });
}

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
