/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Blitter = require('./Blitter');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Blitter Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Blitter Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#blitter
 * @since 3.0.0
 *
 * @param {number} x - The x position of the Game Object.
 * @param {number} y - The y position of the Game Object.
 * @param {string} key - The key of the Texture the Blitter object will use.
 * @param {(string|number)} [frame] - The default Frame children of the Blitter will use.
 *
 * @return {Phaser.GameObjects.Blitter} The Game Object that was created.
 */
GameObjectFactory.register('blitter', function (x, y, key, frame)
{
    return this.displayList.add(new Blitter(this.scene, x, y, key, frame));
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
