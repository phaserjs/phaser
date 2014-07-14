/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser SpriteBatch constructor.
*
* @classdesc The SpriteBatch class is a really fast version of the DisplayObjectContainer built solely for speed, so use when you need a lot of sprites or particles.
* @class Phaser.SpriteBatch
* @extends Phaser.Group
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {Phaser.Group|Phaser.Sprite|null} parent - The parent Group, DisplayObject or DisplayObjectContainer that this Group will be added to. If `undefined` or `null` it will use game.world.
* @param {string} [name=group] - A name for this Group. Not used internally but useful for debugging.
* @param {boolean} [addToStage=false] - If set to true this Group will be added directly to the Game.Stage instead of Game.World.
*/
Phaser.SpriteBatch = function (game, parent, name, addToStage) {

    if (typeof parent === 'undefined' || parent === null) { parent = game.world; }

    PIXI.SpriteBatch.call(this);

    Phaser.Group.call(this, game, parent, name, addToStage);

    /**
    * @property {number} type - Internal Phaser Type value.
    * @protected
    */
    this.type = Phaser.SPRITEBATCH;

};

Phaser.SpriteBatch.prototype = Phaser.Utils.extend(true, Phaser.SpriteBatch.prototype, Phaser.Group.prototype, PIXI.SpriteBatch.prototype);

Phaser.SpriteBatch.prototype.constructor = Phaser.SpriteBatch;
