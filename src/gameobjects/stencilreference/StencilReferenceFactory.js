/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var StencilReference = require('./StencilReference');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new StencilReference Game Object and adds it to the Scene.
 *
 * A StencilReference is a special type of Game Object that can be used to reference a Stencil.
 * You can use a StencilReference to reference a Stencil, and then use the StencilReference to render the Stencil.
 * This is useful for creating complex stencil effects.
 *
 * Note: This method will only be available if the StencilReference Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#stencilreference
 * @since 4.2.0
 *
 * @param {Phaser.GameObjects.Stencil} targetStencil - The Stencil to use as a reference.
 * @param {Phaser.Types.GameObjects.Stencil.StencilOptions} [options] - The options for the StencilReference.
 *
 * @return {Phaser.GameObjects.StencilReference} The Game Object that was created.
 */
GameObjectFactory.register('stencilreference', function (targetStencil, options)
{
    return this.displayList.add(new StencilReference(this.scene, targetStencil, options));
});
