/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Extern = require('./Extern');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Extern Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Extern Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#extern
 * @since 3.16.0
 *
 * @return {Phaser.GameObjects.Extern} The Game Object that was created.
 */
GameObjectFactory.register('extern', function ()
{
    var extern = new Extern(this.scene);

    this.displayList.add(extern);
    this.updateList.add(extern);

    return extern;
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
