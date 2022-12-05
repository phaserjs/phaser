/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var NineSlice = require('./NineSlice');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Nine Slice Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Nine Slice Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#nineslice
 * @webglOnly
 * @since 3.60.0
 *
 * @param {object} sliceConfig -
 * @param {number} [x] - The horizontal position of this Game Object in the world.
 * @param {number} [y] - The vertical position of this Game Object in the world.
 * @param {string|Phaser.Textures.Texture} [texture] - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {string|number} [frame] - An optional frame from the Texture this Game Object is rendering with.
 *
 * @return {Phaser.GameObjects.NineSlice} The Game Object that was created.
 */
if (typeof WEBGL_RENDERER)
{
    GameObjectFactory.register('nineslice', function (sliceConfig, x, y, texture, frame)
    {
        return this.displayList.add(new NineSlice(this.scene, sliceConfig, x, y, texture, frame));
    });
}
