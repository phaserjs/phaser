/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Mesh = require('./Mesh');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Mesh Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Mesh Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#mesh
 * @webglOnly
 * @since 3.0.0
 *
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {number[]} vertices - An array containing the vertices data for this Mesh.
 * @param {number[]} uv - An array containing the uv data for this Mesh.
 * @param {number[]} colors - An array containing the color data for this Mesh.
 * @param {number[]} alphas - An array containing the alpha data for this Mesh.
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 *
 * @return {Phaser.GameObjects.Mesh} The Game Object that was created.
 */
if (typeof WEBGL_RENDERER)
{
    GameObjectFactory.register('mesh', function (x, y, vertices, uv, colors, alphas, texture, frame)
    {
        return this.displayList.add(new Mesh(this.scene, x, y, vertices, uv, colors, alphas, texture, frame));
    });
}

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
