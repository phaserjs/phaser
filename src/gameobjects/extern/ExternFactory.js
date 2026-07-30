/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Extern = require('./Extern');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Extern Game Object and adds it to the Scene's display list.
 *
 * An Extern is a special type of Game Object that allows you to integrate custom rendering
 * logic directly into Phaser's render pipeline. By adding an Extern to the display list,
 * you can inject your own WebGL or Canvas draw calls at a specific point in the rendering
 * order, without Phaser interfering with the renderer state. This is useful when you need
 * to use a third-party renderer, perform custom GPU operations, or render content that
 * Phaser does not natively support, while still having it composited correctly with other
 * Game Objects in your Scene.
 *
 * Note: This method will only be available if the Extern Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#extern
 * @since 3.16.0
 *
 * @return {Phaser.GameObjects.Extern} The Extern Game Object that was created and added to the display list.
 */
GameObjectFactory.register('extern', function ()
{
    var extern = new Extern(this.scene);

    this.displayList.add(extern);

    return extern;
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
