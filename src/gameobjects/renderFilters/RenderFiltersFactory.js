/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var RenderFilters = require('./RenderFilters');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new RenderFilters Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the RenderFilters Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#renderFilters
 * @since 4.0.0
 *
 * @param {Phaser.GameObjects.GameObject} child - The Game Object that is being wrapped by this RenderFilters instance.
 * @param {boolean} [autoFocus=false] - Whether the RenderFilters should automatically focus on the child every frame. Sets `autoFocus` property.
 * @param {boolean} [autoTransfer=false] - Whether the RenderFilters should automatically transfer properties from the child to itself every frame. Sets `autoTransferProperties` property. If not set, it defaults to the `autoFocus` param.
 *
 * @return {Phaser.GameObjects.RenderFilters} The Game Object that was created.
 */
GameObjectFactory.register('renderFilters', function (child, autoFocus, autoTransfer)
{
    return this.displayList.add(new RenderFilters(this.scene, child, autoFocus, autoTransfer));
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
