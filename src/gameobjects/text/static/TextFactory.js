/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Text = require('./Text');
var GameObjectFactory = require('../../GameObjectFactory');

/**
 * Creates a new Text Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Text Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#text
 * @since 3.0.0
 *
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {(string|string[])} text - The text this Text object will display.
 * @param {object} [style] - The Text style configuration object.
 *
 * @return {Phaser.GameObjects.Text} The Game Object that was created.
 */
GameObjectFactory.register('text', function (x, y, text, style)
{
    return this.displayList.add(new Text(this.scene, x, y, text, style));
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
