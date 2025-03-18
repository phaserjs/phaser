/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Zone = require('./Zone');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Zone Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Zone Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#zone
 * @since 3.0.0
 *
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {number} width - The width of the Game Object.
 * @param {number} height - The height of the Game Object.
 *
 * @return {Phaser.GameObjects.Zone} The Game Object that was created.
 */
GameObjectFactory.register('zone', function (x, y, width, height)
{
    return this.displayList.add(new Zone(this.scene, x, y, width, height));
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
