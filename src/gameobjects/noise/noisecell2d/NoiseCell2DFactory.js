/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
*/

var NoiseCell2D = require('./NoiseCell2D');
var GameObjectFactory = require('../../GameObjectFactory');

/**
 * Creates a new NoiseCell2D Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the NoiseCell2D Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#noisecell2d
 * @webglOnly
 * @since 4.0.0
 *
 * @param {(string|Phaser.Types.GameObjects.NoiseCell2D.NoiseCell2DQuadConfig)} [config] - The configuration object this NoiseCell2D will use. This defines the shape and appearance of the NoiseCell2D texture.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [width=128] - The width of the Game Object.
 * @param {number} [height=128] - The height of the Game Object.
 *
 * @return {Phaser.GameObjects.NoiseCell2D} The Game Object that was created.
 */
if (typeof WEBGL_RENDERER)
{
    GameObjectFactory.register('noisecell2d', function (config, x, y, width, height)
    {
        return this.displayList.add(new NoiseCell2D(this.scene, config, x, y, width, height));
    });
}
