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

        }

        /**
         * How long this particle lives before it disappears.
         * NOTE: this is a maximum, not a minimum; the object
         * could get recycled before its lifespan is up.
         */
        public lifespan: number;

        /**
         * The particle's main update logic.  Basically it checks to see if it should be dead yet.
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

        }

        /**
         * Triggered whenever this object is launched by a <code>Emitter</code>.
         * You can override this to add custom behavior like a sound or AI or something.
         */
        public onEmit() {
        }

    }

}