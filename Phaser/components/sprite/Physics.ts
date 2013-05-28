/**
* Phaser - Components - Physics
*
* 
*/

module Phaser.Components {

    export class Physics {

        /**
         * Whether this object will be moved by impacts with other objects or not.
         * @type {boolean}
         */
        public immovable: bool;

        /**
         * Basic speed of this object.
         *
         * Velocity is given in pixels per second. Therefore a velocity of
         * 100 will move at a rate of 100 pixels every 1000 ms (1sec). It's not balls-on
         * accurate due to the way timers work, but it's pretty close. Expect tolerance
         * of +- 10 px. Also that speed assumes no drag.
         *
         * @type {MicroPoint}
         */
        public velocity: MicroPoint;

        /**
         * The virtual mass of the object.
         * @type {number}
         */
        public mass: number;

        /**
         * The bounciness of the object.
         * @type {number}
         */
        public elasticity: number;

        /**
         * How fast the speed of this object is changing.
         * @type {number}
         */
        public acceleration: MicroPoint;

        /**
         * This isn't drag exactly, more like deceleration that is only applied
         * when acceleration is not affecting the sprite.
         * @type {MicroPoint}
         */
        public drag: MicroPoint;

        /**
         * It will cap the speed automatically if you use the acceleration
         * to change its velocity.
         * @type {MicroPoint}
         */
        public maxVelocity: MicroPoint;

        /**
         * How fast this object is rotating.
         * @type {number}
         */
        public angularVelocity: number;

        /**
         * How fast angularVelocity of this object is changing.
         * @type {number}
         */
        public angularAcceleration: number;

        /**
         * Deacceleration of angularVelocity will be applied when it's rotating.
         * @type {number}
         */
        public angularDrag: number;

        /**
         * It will cap the rotate speed automatically if you use the angularAcceleration
         * to change its angularVelocity.
         * @type {number}
         */
        public maxAngular: number;

        /**
         * Set this to false if you want to skip the automatic motion/movement stuff
         * (see updateMotion()).
         * @type {boolean}
         */
        public moves: bool = true;

        /**
         * Bit field of flags (use with UP, DOWN, LEFT, RIGHT, etc) indicating surface contacts.
         * @type {number}
         */
        public touching: number;

        /**
         * Bit field of flags (use with UP, DOWN, LEFT, RIGHT, etc) indicating surface contacts from the previous game loop step.
         * @type {number}
         */
        public wasTouching: number;

        /**
         * Bit field of flags (use with UP, DOWN, LEFT, RIGHT, etc) indicating collision directions.
         * @type {number}
         */
        public allowCollisions: number;

        /**
         * Important variable for collision processing.
         * @type {MicroPoint}
         */
        public last: MicroPoint;

        /**
         * Internal function for updating the position and speed of this object.
         */
        public update() {

            var delta: number;
            var velocityDelta: number;

            velocityDelta = (this._game.motion.computeVelocity(this.angularVelocity, this.angularAcceleration, this.angularDrag, this.maxAngular) - this.angularVelocity) / 2;
            this.angularVelocity += velocityDelta;
            this._angle += this.angularVelocity * this._game.time.elapsed;
            this.angularVelocity += velocityDelta;

            velocityDelta = (this._game.motion.computeVelocity(this.velocity.x, this.acceleration.x, this.drag.x, this.maxVelocity.x) - this.velocity.x) / 2;
            this.velocity.x += velocityDelta;
            delta = this.velocity.x * this._game.time.elapsed;
            this.velocity.x += velocityDelta;
            this.frameBounds.x += delta;

            velocityDelta = (this._game.motion.computeVelocity(this.velocity.y, this.acceleration.y, this.drag.y, this.maxVelocity.y) - this.velocity.y) / 2;
            this.velocity.y += velocityDelta;
            delta = this.velocity.y * this._game.time.elapsed;
            this.velocity.y += velocityDelta;
            this.frameBounds.y += delta;

        }


    }

}