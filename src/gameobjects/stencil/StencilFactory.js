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
 * A Stencil is a special type of Game Object that can hold other Game Objects as children.
 * You can use a Stencil to group related Game Objects together, then move, rotate, scale,
 * or set the alpha of the Stencil to affect all of its children at once. Children are
 * rendered relative to the Stencil's position and transform, making Stencils useful for
 * building composite objects, UI panels, or any group of Game Objects that should move together.
 *
 * Note: This method will only be available if the Stencil Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#stencil
 * @since 4.NEXT
 *
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {'addLayer'|'subtractLayer'} [stencilLayerMode='addLayer'] - The mode to use when rendering the stencil.
 * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} [children] - An optional Game Object, or array of Game Objects, to add to this Stencil.
 * @param {Phaser.Types.Renderer.WebGL.AlphaStrategy} [stencilAlphaStrategy='dither'] - The alpha strategy to use when rendering the stencil.
 * @param {boolean|'auto'} [stencilCompositeCheck='auto'] - Whether to composite the contents of the stencil to a framebuffer.
 *
 * @return {Phaser.GameObjects.Stencil} The Game Object that was created.
 */
GameObjectFactory.register('stencil', function (x, y, stencilLayerMode, children, stencilAlphaStrategy, stencilCompositeCheck)
{
    return this.displayList.add(new Stencil(this.scene, x, y, stencilLayerMode, children, stencilAlphaStrategy, stencilCompositeCheck));
});
