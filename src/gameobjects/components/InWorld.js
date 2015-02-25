Phaser.Component.InWorld = function () {};

Phaser.Component.InWorld.preUpdate = function () {

    //  Cache the bounds if we need it
    if (this.autoCull || this.checkWorldBounds)
    {
        this._bounds.copyFrom(this.getBounds());

        this._bounds.x += this.game.camera.view.x;
        this._bounds.y += this.game.camera.view.y;

        if (this.autoCull)
        {
            //  Won't get rendered but will still get its transform updated
            if (this.game.world.camera.view.intersects(this._bounds))
            {
                this.renderable = true;
                this.game.world.camera.totalInView++;
            }
            else
            {
                this.renderable = false;
            }
        }

        if (this.checkWorldBounds)
        {
            //  The Sprite is already out of the world bounds, so let's check to see if it has come back again
            if (this._outOfBoundsFired && this.game.world.bounds.intersects(this._bounds))
            {
                this._outOfBoundsFired = false;
                this.events.onEnterBounds$dispatch(this);
            }
            else if (!this._outOfBoundsFired && !this.game.world.bounds.intersects(this._bounds))
            {
                //  The Sprite WAS in the screen, but has now left.
                this._outOfBoundsFired = true;
                this.events.onOutOfBounds$dispatch(this);

                if (this.outOfBoundsKill)
                {
                    this.kill();
                    return false;
                }
            }
        }
    }

    return true;

};

Phaser.Component.InWorld.prototype = {

    /**
    * If true the Sprite checks if it is still within the world each frame, when it leaves the world it dispatches Sprite.events.onOutOfBounds
    * and optionally kills the sprite (if Sprite.outOfBoundsKill is true). By default this is disabled because the Sprite has to calculate its
    * bounds every frame to support it, and not all games need it. Enable it by setting the value to true.
    * @property {boolean} checkWorldBounds
    * @default
    */
    checkWorldBounds: false,

    /**
    * @property {boolean} outOfBoundsKill - If true Sprite.kill is called as soon as Sprite.inWorld returns false, as long as Sprite.checkWorldBounds is true.
    * @default
    */
    outOfBoundsKill: false,

    /**
    * @property {boolean} _outOfBoundsFired - Internal cache var.
    * @private
    */
    _outOfBoundsFired: false,

    /**
    * Checks if the Sprite bounds are within the game world, otherwise false if fully outside of it.
    *
    * @name Phaser.Sprite#inWorld
    * @property {boolean} inWorld - True if the Sprite bounds is within the game world, even if only partially. Otherwise false if fully outside of it.
    * @readonly
    */
    inWorld: {

        get: function() {

            return this.game.world.bounds.intersects(this.getBounds());

        }

    }

};
