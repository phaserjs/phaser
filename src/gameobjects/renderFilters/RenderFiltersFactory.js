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
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 *
 * @return {Phaser.GameObjects.RenderFilters} The Game Object that was created.
 */
GameObjectFactory.register('renderFilters', function (child, x, y)
{
    return this.displayList.add(new RenderFilters(this.scene, child, x, y));
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
