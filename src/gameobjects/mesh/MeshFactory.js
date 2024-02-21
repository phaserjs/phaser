/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
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
 * @param {number} [x] - The horizontal position of this Game Object in the world.
 * @param {number} [y] - The vertical position of this Game Object in the world.
 * @param {string|Phaser.Textures.Texture} [texture] - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {string|number} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @param {number[]} [vertices] - The vertices array. Either `xy` pairs, or `xyz` if the `containsZ` parameter is `true`.
 * @param {number[]} [uvs] - The UVs pairs array.
 * @param {number[]} [indicies] - Optional vertex indicies array. If you don't have one, pass `null` or an empty array.
 * @param {boolean} [containsZ=false] - Does the vertices data include a `z` component?
 * @param {number[]} [normals] - Optional vertex normals array. If you don't have one, pass `null` or an empty array.
 * @param {number|number[]} [colors=0xffffff] - An array of colors, one per vertex, or a single color value applied to all vertices.
 * @param {number|number[]} [alphas=1] - An array of alpha values, one per vertex, or a single alpha value applied to all vertices.
 *
 * @return {Phaser.GameObjects.Mesh} The Game Object that was created.
 */
if (typeof WEBGL_RENDERER)
{
    GameObjectFactory.register('mesh', function (x, y, texture, frame, vertices, uvs, indicies, containsZ, normals, colors, alphas)
    {
        return this.displayList.add(new Mesh(this.scene, x, y, texture, frame, vertices, uvs, indicies, containsZ, normals, colors, alphas));
    });
}
