/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Reset component allows a Game Object to be reset and repositioned to a new location.
*
* @class
*/
Phaser.Component.Reset = function () {};

/**
* Resets the Game Object.
* 
* This moves the Game Object to the given x/y world coordinates and sets `fresh`, `exists`, 
* `visible` and `renderable` to true.
*
* If this Game Object has the LifeSpan component it will also set `alive` to true and `health` to the given value.
*
* If this Game Object has a Physics Body it will reset the Body.
*
* @method
* @param {number} x - The x coordinate (in world space) to position the Game Object at.
* @param {number} y - The y coordinate (in world space) to position the Game Object at.
* @param {number} [health=1] - The health to give the Game Object if it has the Health component.
* @return {PIXI.DisplayObject} This instance.
*/
Phaser.Component.Reset.prototype.reset = function (x, y, health) {

    if (health === undefined) { health = 1; }

    this.world.set(x, y);
    this.position.set(x, y);

    this.fresh = true;
    this.exists = true;
    this.visible = true;
    this.renderable = true;

    if (this.components.InWorld)
    {
        this._outOfBoundsFired = false;
    }

    if (this.components.LifeSpan)
    {
        this.alive = true;
        this.health = health;
    }

    if (this.components.PhysicsBody)
    {
        if (this.body)
        {
            this.body.reset(x, y, false, false);
        }
    }

    return this;

};
