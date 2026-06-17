/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
*/

var CustomContext = require('./CustomContext');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new CustomContext Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the CustomContext Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#customContext
 * @webglOnly
 * @since 4.NEXT
 *
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {Phaser.GameObjects.GameObject[]} [children] - An optional array of Game Objects to add to the Custom Context.
 * @param {Phaser.Types.Renderer.WebGL.DrawingContextOptions} [options] - The options for the custom DrawingContext. If undefined, the custom DrawingContext will be a copy of the base DrawingContext.
 * @param {Phaser.Types.GameObjects.CustomContext.CustomContextCallback} [customContextCallback] - A function to be called before the custom DrawingContext is activated. If undefined, no callback will be called.
 *
 * @return {Phaser.GameObjects.CustomContext} The Game Object that was created.
 */
if (typeof WEBGL_RENDERER)
{
    GameObjectFactory.register('customcontext', function (x, y, children, options, customContextCallback)
    {
        return this.displayList.add(new CustomContext(this.scene, x, y, children, options, customContextCallback));
    });
}
