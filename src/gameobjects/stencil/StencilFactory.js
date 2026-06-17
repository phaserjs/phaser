/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Stencil = require('./Stencil');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Stencil Game Object and adds it to the Scene.
 *
 * A Stencil is a special type of Game Object used to place stencils over the canvas.
 * You can use it to efficiently control where subsequent objects are rendered.
 * It is WebGL-only.
 * Study the documentation ({@link Phaser.GameObjects.Stencil}) carefully to understand how it works.
 *
 * A Stencil is an extended Container Game Object.
 * It contains a list of child Game Objects to render to the stencil buffer.
 * Think of these as opaque sheets of card held up over the canvas,
 * preventing anything from being drawn through them.
 *
 * Note: This method will only be available if the Stencil Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#stencil
 * @since 4.NEXT
 *
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} [children] - An optional Game Object, or array of Game Objects, to add to this Stencil.
 * @param {Phaser.Types.GameObjects.Stencil.StencilOptions} [options] - The options for the Stencil.
 *
 * @return {Phaser.GameObjects.Stencil} The Game Object that was created.
 */
GameObjectFactory.register('stencil', function (x, y, children, options)
{
    return this.displayList.add(new Stencil(this.scene, x, y, children, options));
});
