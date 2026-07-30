/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
*/

var Noise = require('./Noise');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Noise Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Noise Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#noise
 * @webglOnly
 * @since 4.0.0
 *
 * @param {(string|Phaser.Types.GameObjects.Noise.NoiseQuadConfig)} [config] - The configuration object this Noise will use. This defines the shape and appearance of the noise texture.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [width=128] - The width of the Game Object, in pixels.
 * @param {number} [height=128] - The height of the Game Object, in pixels.
 *
 * @return {Phaser.GameObjects.Noise} The Game Object that was created.
 */
if (typeof WEBGL_RENDERER)
{
    GameObjectFactory.register('noise', function (config, x, y, width, height)
    {
        return this.displayList.add(new Noise(this.scene, config, x, y, width, height));
    });
}
