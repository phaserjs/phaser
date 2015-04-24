/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Kestrel Moon Studios <creature@kestrelmoon.com>
* @copyright    2015 Photon Storm Ltd and Kestrel Moon Studios
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creature is a custom Game Object used in conjunction with the Creature Runtime libraries by Kestrel Moon Studios.
* 
* It allows you to display animated Game Objects that were created with the [Creature Automated Animation Tool](http://www.kestrelmoon.com/creature/).
* 
* Note 1: You can only use Phaser.Creature objects in WebGL enabled games. They do not work in Canvas mode games.
*
* Note 2: You must use a build of Phaser that includes the Creature runtimes, or have them loaded before your Phaser game boots. 
* See the Phaser custom build process for more details. By default the Creature runtimes are NOT included in any pre-configured version of Phaser.
* So you'll need to do `grunt custom` to specify a build that includes them.
*
* @class Phaser.Creature
* @extends PIXI.DisplayObjectContainer
* @extends Phaser.Component.Core
* @extends Phaser.Component.Angle
* @extends Phaser.Component.AutoCull
* @extends Phaser.Component.BringToTop
* @extends Phaser.Component.Destroy
* @extends Phaser.Component.FixedToCamera
* @extends Phaser.Component.LifeSpan
* @extends Phaser.Component.Reset
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {CreatureManager} manager - A reference to the CreatureManager instance.
* @param {number} x - The x coordinate of the Game Object. The coordinate is relative to any parent container this Game Object may be in.
* @param {number} y - The y coordinate of the Game Object. The coordinate is relative to any parent container this Game Object may be in.
* @param {string|PIXI.Texture} key - The texture used by the Creature Object during rendering. It can be a string which is a reference to the Cache entry, or an instance of a PIXI.Texture.
*/
Phaser.Creature = function (game, manager, x, y, key) {

    x = x || 0;
    y = y || 0;
    key = key || null;

    /**
    * @property {number} type - The const type of this object.
    * @readonly
    */
    this.type = Phaser.CREATURE;

    /**
    * @property {number} timeDelta - How quickly the animation time/playback advances
    */
    this.timeDelta = 0.05;

    /**
    * @property {CreatureManager} _manager - The CreatureManager
    * @private
    */
    this._manager = manager;

    if (typeof key === 'string')
    {
        var texture = game.cache.getPixiTexture(key);
    }
    else
    {
        var texture = key;
    }

    CreatureRenderer.call(this, manager, texture);

    Phaser.Component.Core.init.call(this, game, x, y);

};

Phaser.Creature.prototype = Object.create(CreatureRenderer.prototype);
Phaser.Creature.prototype.constructor = Phaser.Creature;

Phaser.Component.Core.install.call(Phaser.Creature.prototype, [
    'Angle',
    'AutoCull',
    'BringToTop',
    'Destroy',
    'FixedToCamera',
    'LifeSpan',
    'Reset'
]);

Phaser.Creature.prototype.preUpdateInWorld = Phaser.Component.InWorld.preUpdate;
Phaser.Creature.prototype.preUpdateCore = Phaser.Component.Core.preUpdate;

/**
* Automatically called by World.preUpdate.
*
* @method Phaser.Creature#preUpdate
* @memberof Phaser.Creature
*/
Phaser.Creature.prototype.preUpdate = function() {

    if (!this.preUpdateInWorld())
    {
        return false;
    }

    this._manager.Update(this.timeDelta);

    this.UpdateData();

    return this.preUpdateCore();

};
