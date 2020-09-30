/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Layer3DScene = require('./Layer3DScene');
var GameObjectFactory = require('../gameobjects/GameObjectFactory');

/**
 * Creates a new Layer3DScene Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Layer3DScene Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#layer3d
 * @webglOnly
 * @since 3.50.0
 *
 * @param {number} [x] - The horizontal position of this Game Object in the world.
 * @param {number} [y] - The vertical position of this Game Object in the world.
 *
 * @return {Phaser.Layer3D.Layer3DScene} The Game Object that was created.
 */
if (typeof WEBGL_RENDERER)
{
    GameObjectFactory.register('layer3d', function (x, y)
    {
        return this.displayList.add(new Layer3DScene(this.scene, x, y));
    });
}
