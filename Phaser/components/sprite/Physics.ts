/// <reference path="../../core/Vec2.ts" />
/// <reference path="../../core/Point.ts" />
/// <reference path="../../physics/AABB.ts" />

/**
* Phaser - Components - Physics
*
* 
*/

module Phaser.Components {

    export class Physics {

        constructor(parent: Sprite) {

            this._game = parent.game;
            this._sprite = parent;

            //this.AABB = new Phaser.Physics.AABB(this._game, this._sprite, this._sprite.x, this._sprite.y, this._sprite.width, this._sprite.height);
            this.AABB = this._game.world.physics.add(new Phaser.Physics.AABB(this._game, this._sprite, this._sprite.x, this._sprite.y, this._sprite.width, this._sprite.height));

        }

        /**
         * 
         */
        private _game: Game;

        /**
         * 
         */
        private _sprite: Sprite;

        public AABB: Phaser.Physics.AABB;

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
         * @type {Vec2}
         */
        public velocity: Vec2;

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
        public acceleration: Vec2;

        /**
         * This isn't drag exactly, more like deceleration that is only applied
         * when acceleration is not affecting the sprite.
         * @type {Vec2}
         */
        public drag: Vec2;

        /**
         * It will cap the speed automatically if you use the acceleration
         * to change its velocity.
         * @type {Vec2}
         */
        public maxVelocity: Vec2;

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
         * @type {Vec2}
         */
        public last: Vec2;

        /**
        * Handy for checking if this object is touching a particular surface.
        * For slightly better performance you can just &amp; the value directly into <code>touching</code>.
        * However, this method is good for readability and accessibility.
        *
        * @param Direction {number} Any of the collision flags (e.g. LEFT, FLOOR, etc).
        *
        * @return {boolean} Whether the object is touching an object in (any of) the specified direction(s) this frame.
        */
        //public isTouching(direction: number): bool {
        //    return (this.touching & direction) > Collision.NONE;
        //}

        /**
        * Handy function for checking if this object just landed on a particular surface.
        *
        * @param Direction {number} Any of the collision flags (e.g. LEFT, FLOOR, etc).
        *
        * @returns {boolean} Whether the object just landed on any specicied surfaces.
        */
        //public justTouched(direction: number): bool {
        //    return ((this.touching & direction) > Collision.NONE) && ((this.wasTouching & direction) <= Collision.NONE);
        //}


        /**
         * Internal function for updating the position and speed of this object.
         */
        public update() {

            if (this.moves)
            {
                this._sprite.x = this.AABB.position.x - this.AABB.halfWidth;
                this._sprite.y = this.AABB.position.y - this.AABB.halfHeight;
            }

/*
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
*/

        }

        /**
        * Whether the object collides or not.  For more control over what directions
        * the object will collide from, use collision constants (like LEFT, FLOOR, etc)
        * to set the value of allowCollisions directly.
        */
        //public get solid(): bool {
        //    return (this.allowCollisions & Collision.ANY) > Collision.NONE;
        //}

        public set solid(value: bool) {

            //if (value)
            //{
            //    this.allowCollisions = Collision.ANY;
            //}
            //else
            //{
            //    this.allowCollisions = Collision.NONE;
            //}

        }

    }

}