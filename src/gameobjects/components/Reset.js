/**
* Reset Component Features.
*
* @class
*/
Phaser.Component.Reset = function () {};

/**
* Resets the Sprite. This places the Sprite at the given x/y world coordinates and then
* sets alive, exists, visible and renderable all to true. Also resets the outOfBounds state and health values.
* If the Sprite has a physics body that too is reset.
*
* @method
* @param {number} x - The x coordinate (in world space) to position the Sprite at.
* @param {number} y - The y coordinate (in world space) to position the Sprite at.
* @param {number} [health=1] - The health to give the Sprite. Only applies if the GameObject has the Health component.
* @return (Phaser.Sprite) This instance.
*/
Phaser.Component.Reset.prototype.reset = function(x, y, health) {

    if (typeof health === 'undefined') { health = 1; }

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
