/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
*/

var Gradient = require('./Gradient');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Gradient Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Gradient Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#gradient
 * @webglOnly
 * @since 4.0.0
 *
 * @param {(string|Phaser.Types.GameObjects.Gradient.GradientQuadConfig)} [config] - The configuration object this Gradient will use. This defines the shape and appearance of the gradient texture.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [width=128] - The width of the Game Object.
 * @param {number} [height=128] - The height of the Game Object.
 *
 * @return {Phaser.GameObjects.Gradient} The Game Object that was created.
 */
if (typeof WEBGL_RENDERER)
{
    GameObjectFactory.register('gradient', function (config, x, y, width, height)
    {
        return this.displayList.add(new Gradient(this.scene, config, x, y, width, height));
    });
}
