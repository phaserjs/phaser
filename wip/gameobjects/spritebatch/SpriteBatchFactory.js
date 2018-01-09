/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.GameObject.SpriteBatch.FACTORY_KEY = 'spriteBatch';

/**
* A SpriteBatch is a really fast version of a Phaser Group built solely for speed.
* Use when you need a lot of sprites or particles all sharing the same texture.
* The speed gains are specifically for WebGL. In Canvas mode you won't see any real difference.
*
* @method Phaser.GameObject.Factory#spriteBatch
* @param {Phaser.Group|null} parent - The parent Group that will hold this Sprite Batch. Set to `undefined` or `null` to add directly to game.world.
* @param {string} [name='group'] - A name for this Sprite Batch. Not used internally but useful for debugging.
* @param {boolean} [addToStage=false] - If set to true this Sprite Batch will be added directly to the Game.Stage instead of the parent.
* @return {Phaser.SpriteBatch} The newly created Sprite Batch.
*/
Phaser.GameObject.SpriteBatch.FACTORY_ADD = function (parent, name, addToStage)
{
    if (parent === undefined) { parent = null; }
    if (name === undefined) { name = 'group'; }
    if (addToStage === undefined) { addToStage = false; }

    return new Phaser.GameObject.SpriteBatch(this.game, parent, name, addToStage);
};

/**
* A SpriteBatch is a really fast version of a Phaser Group built solely for speed.
* Use when you need a lot of sprites or particles all sharing the same texture.
* The speed gains are specifically for WebGL. In Canvas mode you won't see any real difference.
*
* @method Phaser.GameObject.Factory#spriteBatch
* @param {Phaser.Group|null} parent - The parent Group that will hold this Sprite Batch. Set to `undefined` or `null` to add directly to game.world.
* @param {string} [name='group'] - A name for this Sprite Batch. Not used internally but useful for debugging.
* @param {boolean} [addToStage=false] - If set to true this Sprite Batch will be added directly to the Game.Stage instead of the parent.
* @return {Phaser.SpriteBatch} The newly created Sprite Batch.
*/
Phaser.GameObject.SpriteBatch.FACTORY_MAKE = function (parent, name)
{
    if (parent === undefined) { parent = null; }
    if (name === undefined) { name = 'group'; }

    return new Phaser.GameObject.SpriteBatch(this.game, parent, name);
};
