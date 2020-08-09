/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Rope = require('./Rope');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Rope Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Rope Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#rope
 * @webglOnly
 * @since 3.23.0
 *
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @param {Phaser.Types.Math.Vector2Like[]} [points] - An array containing the vertices data for this Rope. If none is provided a simple quad is created. See `setPoints` to set this post-creation.
 * @param {boolean} [horizontal=true] - Should the vertices of this Rope be aligned horizontally (`true`), or vertically (`false`)?
 * @param {number[]} [colors] - An optional array containing the color data for this Rope. You should provide one color value per pair of vertices.
 * @param {number[]} [alphas] - An optional array containing the alpha data for this Rope. You should provide one alpha value per pair of vertices.
 *
 * @return {Phaser.GameObjects.Rope} The Game Object that was created.
 */
if (typeof WEBGL_RENDERER)
{
    GameObjectFactory.register('rope', function (x, y, texture, frame, points, horizontal, colors, alphas)
    {
        var rope = new Rope(this.scene, x, y, texture, frame, points, horizontal, colors, alphas);

        this.displayList.add(rope);

        return this.updateList.add(rope);
    });
}

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
