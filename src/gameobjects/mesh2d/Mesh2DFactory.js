/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Mesh2D = require('./Mesh2D');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Mesh2D Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Mesh2D Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#mesh2d
 * @since 4.2.0
 *
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {number[]} vertices - The vertices of the mesh.
 * @param {number[]} indices - The indices of the mesh.
 * @param {boolean} [flipV=false] - Whether to flip the texture vertically.
 *
 * @return {Phaser.GameObjects.Mesh2D} The Game Object that was created.
 */
GameObjectFactory.register('mesh2d', function (x, y, texture, vertices, indices, flipV)
{
    return this.displayList.add(new Mesh2D(this.scene, x, y, texture, vertices, indices, flipV));
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
