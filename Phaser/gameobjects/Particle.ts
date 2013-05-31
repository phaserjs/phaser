/// <reference path="../Game.ts" />
/// <reference path="Sprite.ts" />

/**
* Phaser - Particle
*
* This is a simple particle class that extends a Sprite to have a slightly more
* specialised behaviour. It is used exclusively by the Emitter class and can be extended as required.
*/

module Phaser {

    export class Particle extends Sprite {

        /**
         * Instantiate a new particle.  Like <code>Sprite</code>, all meaningful creation
         * happens during <code>loadGraphic()</code> or <code>makeGraphic()</code> or whatever.
         */
        constructor(game: Game) {

            super(game);

            this.body.type = Types.BODY_DYNAMIC;
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

            //  Lifespan behavior
            if (this.lifespan <= 0)
            {
                return;
            }

            this.lifespan -= this.game.time.elapsed;

            if (this.lifespan <= 0)
            {
                this.kill();
            }

            //simpler bounce/spin behavior for now
            if (this.body.touching)
            {
                if (this.body.angularVelocity != 0)
                {
                    this.body.angularVelocity = -this.body.angularVelocity;
                }
            }

            if (this.body.acceleration.y > 0) //special behavior for particles with gravity
            {
                if (this.body.touching & Types.FLOOR)
                {
                    this.body.drag.x = this.friction;

                    if (!(this.body.wasTouching & Types.FLOOR))
                    {
                        if (this.body.velocity.y < -this.body.bounce.y * 10)
                        {
                            if (this.body.angularVelocity != 0)
                            {
                                this.body.angularVelocity *= -this.body.bounce.y;
                            }
                        }
                        else
                        {
                            this.body.velocity.y = 0;
                            this.body.angularVelocity = 0;
                        }
                    }
                }
                else
                {
                    this.body.drag.x = 0;
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

}