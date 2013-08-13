/// <reference path="../_definitions.ts" />

/**
* Phaser - Physics - PhysicsManager
*/

module Phaser.Physics {

    export class PhysicsManager {

        constructor(game: Phaser.Game) {

            this.game = game;

            //this.gravity = new Vec2;
            //this.drag = new Vec2;
            //this.bounce = new Vec2;
            //this.angularDrag = 0;

            //this.bounds = new Rectangle(0, 0, width, height);

            //this._distance = new Vec2;
            //this._tangent = new Vec2;

        }

        public game: Phaser.Game;

        //  Temp calculation vars
        private _drag: number;
        private _delta: number;
        private _velocityDelta: number;
        private _length: number = 0;
        private _distance: Vec2;
        private _tangent: Vec2;
        private _separatedX: bool;
        private _separatedY: bool;
        private _overlap: number;
        private _maxOverlap: number;
        private _obj1Velocity: number;
        private _obj2Velocity: number;
        private _obj1NewVelocity: number;
        private _obj2NewVelocity: number;
        private _average: number;
        private _quadTree: QuadTree;
        private _quadTreeResult: bool;

        //public bounds: Rectangle;

        //public gravity: Vec2;
        //public drag: Vec2;
        //public bounce: Vec2;
        //public angularDrag: number;

        grav: number = 0.2;
        drag: number = 1;
        bounce: number = 0.3;
        friction: number = 0.05;

        min_f: number = 0;
        max_f: number = 1;

        min_b: number = 0;
        max_b: number = 1;

        min_g: number = 0;
        max_g = 1;

        xmin: number = 0;
        xmax: number = 800;
        ymin: number = 0;
        ymax: number = 600;

        objrad: number = 24;
        tilerad: number = 24 * 2;
        objspeed: number = 0.2;
        maxspeed: number = 20;

        public update() {
        }

        public updateMotion(body: Phaser.Physics.Body) {

            this._velocityDelta = (this.computeVelocity(body.angularVelocity, body.gravity.x, body.angularAcceleration, body.angularDrag, body.maxAngular) - body.angularVelocity) / 2;
            body.angularVelocity += this._velocityDelta;
            body.sprite.transform.rotation += body.angularVelocity * this.game.time.physicsElapsed;
            body.angularVelocity += this._velocityDelta;

            this._velocityDelta = (this.computeVelocity(body.velocity.x, body.gravity.x, body.acceleration.x, body.drag.x) - body.velocity.x) / 2;
            body.velocity.x += this._velocityDelta;
            this._delta = body.velocity.x * this.game.time.physicsElapsed;

            body.aabb.pos.x += this._delta;
            body.deltaX = this._delta;

            this._velocityDelta = (this.computeVelocity(body.velocity.y, body.gravity.y, body.acceleration.y, body.drag.y) - body.velocity.y) / 2;
            body.velocity.y += this._velocityDelta;
            this._delta = body.velocity.y * this.game.time.physicsElapsed;

            body.aabb.pos.y += this._delta;
            body.deltaY = this._delta;

            //body.aabb.integrateVerlet();

        }

        /**
        * A tween-like function that takes a starting velocity and some other factors and returns an altered velocity.
        *
        * @param {number} Velocity Any component of velocity (e.g. 20).
        * @param {number} Acceleration Rate at which the velocity is changing.
        * @param {number} Drag Really kind of a deceleration, this is how much the velocity changes if Acceleration is not set.
        * @param {number} Max An absolute value cap for the velocity.
        *
        * @return {number} The altered Velocity value.
        */
        public computeVelocity(velocity: number, gravity: number = 0, acceleration: number = 0, drag: number = 0, max: number = 10000): number {

            if (acceleration !== 0)
            {
                velocity += (acceleration + gravity) * this.game.time.physicsElapsed;
            }
            else if (drag !== 0)
            {
                this._drag = drag * this.game.time.physicsElapsed;

                if (velocity - this._drag > 0)
                {
                    velocity = velocity - this._drag;
                }
                else if (velocity + this._drag < 0)
                {
                    velocity += this._drag;
                }
                else
                {
                    velocity = 0;
                }

                //velocity += gravity;
            }

            velocity += gravity;

            if (velocity != 0)
            {
                if (velocity > max)
                {
                    velocity = max;
                }
                else if (velocity < -max)
                {
                    velocity = -max;
                }
            }

            return velocity;

        }

    }

}
