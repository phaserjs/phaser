Phaser.Component.LifeSpan = function () {};

Phaser.Component.LifeSpan.preUpdate = function () {

    if (this.lifespan > 0)
    {
        this.lifespan -= this.game.time.physicsElapsedMS;

        if (this.lifespan <= 0)
        {
            this.kill();
            return false;
        }
    }

    return true;

};

Phaser.Component.LifeSpan.prototype = {

    /**
    * @property {boolean} alive - A useful boolean to control if the Sprite is alive or dead (in terms of your gameplay, it doesn't effect rendering). Also linked to Sprite.health and Sprite.damage.
    * @default
    */
    alive: true,

    /**
    * To given a Sprite a lifespan, in milliseconds, once 'born' you can set this to a positive value. Handy for particles, bullets, etc.
    *
    * The lifespan is decremented by `game.time.physicsElapsed` (converted to milliseconds) each logic update,
    * and {@link Phaser.Sprite.kill kill} is called once the lifespan reaches 0.
    *
    * @property {number} lifespan
    * @default
    */
    lifespan: 0,

    /**
    * Brings a 'dead' Sprite back to life, optionally giving it the health value specified.
    * A resurrected Sprite has its alive, exists and visible properties all set to true.
    * It will dispatch the onRevived event, you can listen to Sprite.events.onRevived for the signal.
    *
    * @method Phaser.Sprite#revive
    * @memberof Phaser.Sprite
    * @param {number} [health=1] - The health to give the Sprite. Only applies if the GameObject has the Health component.
    * @return (Phaser.Sprite) This instance.
    */
    revive: function(health) {

        if (typeof health === 'undefined') { health = 1; }

        this.alive = true;
        this.exists = true;
        this.visible = true;
 
        if (typeof this.health === 'number')
        {
            this.health = health;
        }

        if (this.events)
        {
            this.events.onRevived$dispatch(this);
        }

        return this;

    },

    /**
    * Kills a Sprite. A killed Sprite has its alive, exists and visible properties all set to false.
    * It will dispatch the onKilled event, you can listen to Sprite.events.onKilled for the signal.
    * Note that killing a Sprite is a way for you to quickly recycle it in a Sprite pool, it doesn't free it up from memory.
    * If you don't need this Sprite any more you should call Sprite.destroy instead.
    *
    * @method Phaser.Sprite#kill
    * @memberof Phaser.Sprite
    * @return (Phaser.Sprite) This instance.
    */
    kill: function() {

        this.alive = false;
        this.exists = false;
        this.visible = false;

        if (this.events)
        {
            this.events.onKilled$dispatch(this);
        }

        return this;

    }

};
