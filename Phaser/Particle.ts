/// <reference path="Sprite.ts" />

/**
 * This is a simple particle class that extends the default behavior
 * of <code>Sprite</code> to have slightly more specialized behavior
 * common to many game scenarios.  You can override and extend this class
 * just like you would <code>Sprite</code>. While <code>Emitter</code>
 * used to work with just any old sprite, it now requires a
 * <code>Particle</code> based class.
 * 
 * @author Adam Atomic
 * @author Richard Davey
 */
class Particle extends Sprite {

    /**
     * Instantiate a new particle.  Like <code>Sprite</code>, all meaningful creation
     * happens during <code>loadGraphic()</code> or <code>makeGraphic()</code> or whatever.
     */
    constructor(game: Game) {

        super(game);

        this.lifespan = 0;
        this.friction = 500;
    }

    /**
     * How long this particle lives before it disappears.
     * NOTE: this is a maximum, not a minimum; the object
     * could get recycled before its lifespan is up.
     */
    public lifespan: number;

    /**
     * Determines how quickly the particles come to rest on the ground.
     * Only used if the particle has gravity-like acceleration applied.
     * @default 500
     */
    public friction: number;

    /**
     * The particle's main update logic.  Basically it checks to see if it should
     * be dead yet, and then has some special bounce behavior if there is some gravity on it.
     */
    public update() {
        //lifespan behavior
        if (this.lifespan <= 0)
        {
            return;
        }

        this.lifespan -= this._game.time.elapsed;

        if (this.lifespan <= 0)
        {
            this.kill();
        }

        //simpler bounce/spin behavior for now
        if (this.touching)
        {
            if (this.angularVelocity != 0)
            {
                this.angularVelocity = -this.angularVelocity;
            }
        }

        if (this.acceleration.y > 0) //special behavior for particles with gravity
        {
            if (this.touching & GameObject.FLOOR)
            {
                this.drag.x = this.friction;

                if (!(this.wasTouching & GameObject.FLOOR))
                {
                    if (this.velocity.y < -this.elasticity * 10)
                    {
                        if (this.angularVelocity != 0)
                        {
                            this.angularVelocity *= -this.elasticity;
                        }
                    }
                    else
                    {
                        this.velocity.y = 0;
                        this.angularVelocity = 0;
                    }
                }
            }
            else
            {
                this.drag.x = 0;
            }
        }
    }

    /**
     * Triggered whenever this object is launched by a <code>Emitter</code>.
     * You can override this to add custom behavior like a sound or AI or something.
     */
    public onEmit() {
    }
}
