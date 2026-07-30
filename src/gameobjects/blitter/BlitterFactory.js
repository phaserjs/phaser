/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Blitter = require('./Blitter');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Blitter Game Object and adds it to the Scene.
 *
 * A Blitter is a special, highly optimized Game Object designed for rendering large numbers of
 * identical or similar images with minimal overhead. Rather than creating individual Game Objects
 * for each image, a Blitter manages a collection of lightweight `Bob` objects, all sharing the
 * same texture. This makes it ideal for particle-like effects, crowds, bullet patterns, or any
 * scenario where you need to display many copies of the same sprite at high performance.
 *
 * Note: This method will only be available if the Blitter Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#blitter
 * @since 3.0.0
 *
 * @param {number} x - The x position of the Game Object.
 * @param {number} y - The y position of the Game Object.
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|number)} [frame] - The default Frame children of the Blitter will use.
 *
 * @return {Phaser.GameObjects.Blitter} The Game Object that was created.
 */
GameObjectFactory.register('blitter', function (x, y, texture, frame)
{
    return this.displayList.add(new Blitter(this.scene, x, y, texture, frame));
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
