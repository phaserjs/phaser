/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
*/

var NoiseCell3D = require('./NoiseCell3D');
var GameObjectFactory = require('../../GameObjectFactory');

/**
 * Creates a new NoiseCell3D Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the NoiseCell3D Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#noisecell3d
 * @webglOnly
 * @since 4.0.0
 *
 * @param {(string|Phaser.Types.GameObjects.NoiseCell3D.NoiseCell3DQuadConfig)} [config] - The configuration object this NoiseCell3D will use. This defines the shape and appearance of the NoiseCell3D texture.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [width=128] - The width of the Game Object.
 * @param {number} [height=128] - The height of the Game Object.
 *
 * @return {Phaser.GameObjects.NoiseCell3D} The Game Object that was created.
 */
if (typeof WEBGL_RENDERER)
{
    GameObjectFactory.register('noisecell3d', function (config, x, y, width, height)
    {
        return this.displayList.add(new NoiseCell3D(this.scene, config, x, y, width, height));
    });
}
