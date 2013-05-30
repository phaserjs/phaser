/// <reference path="../Game.ts" />
/// <reference path="IPhysicsShape.ts" />

/**
* Phaser - PhysicsManager
*
* Your game only has one PhysicsManager instance and it's responsible for looking after, creating and colliding
* all of the physics objects in the world.
*/

module Phaser.Physics {

    export class PhysicsManager {

        constructor(game: Game, width: number, height: number) {

            this.game = game;

            this.gravity = new Vec2;
            this.drag = new Vec2;
            this.bounce = new Vec2;
            this.friction = new Vec2;

            this.bounds = new Rectangle(0, 0, width, height); 

            this._objects = [];

        }

        /**
         * Local private reference to Game.
         */
        public game: Game;

        private _objects: IPhysicsShape[];

        //  Temp calculation vars
        private _drag: number;
        private _delta: number;
        private _velocityDelta: number;
        private _length: number = 0;

        public bounds: Rectangle;

        public gravity: Vec2;
        public drag: Vec2;
        public bounce: Vec2;
        public friction: Vec2;

        //  Add some sanity checks here + remove method, etc
        public add(shape: IPhysicsShape): IPhysicsShape {

            this._objects.push(shape);
            return shape;

        }

        public update() {

            this._length = this._objects.length;

            for (var i = 0; i < this._length; i++)
            {
                this._objects[i].preUpdate();
                this.updateMotion(this._objects[i]);
                this.collideWorld(this._objects[i]);
            }

        }

        public render() {

            //  iterate through the objects here, updating and colliding
            for (var i = 0; i < this._length; i++)
            {
                this._objects[i].render(this.game.stage.context);
            }

        }

        private updateMotion(obj: IPhysicsShape) {

            if (obj.physics.moves == false)
            {
                return;
            }

            /*
            velocityDelta = (this._game.motion.computeVelocity(this.angularVelocity, this.angularAcceleration, this.angularDrag, this.maxAngular) - this.angularVelocity) / 2;
            this.angularVelocity += velocityDelta;
            this._angle += this.angularVelocity * this._game.time.elapsed;
            this.angularVelocity += velocityDelta;
            */

            this._velocityDelta = (this.computeVelocity(obj.physics.velocity.x, obj.physics.gravity.x, obj.physics.acceleration.x, obj.physics.drag.x) - obj.physics.velocity.x) / 2;
            obj.physics.velocity.x += this._velocityDelta;
            this._delta = obj.physics.velocity.x * this.game.time.elapsed;
            obj.physics.velocity.x += this._velocityDelta;
            obj.position.x += this._delta;

            this._velocityDelta = (this.computeVelocity(obj.physics.velocity.y, obj.physics.gravity.y, obj.physics.acceleration.y, obj.physics.drag.y) - obj.physics.velocity.y) / 2;
            obj.physics.velocity.y += this._velocityDelta;
            this._delta = obj.physics.velocity.y * this.game.time.elapsed;
            obj.physics.velocity.y += this._velocityDelta;
            obj.position.y += this._delta;

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
                velocity += (acceleration + gravity) * this.game.time.elapsed;
            }
            else if (drag !== 0)
            {
                this._drag = drag * this.game.time.elapsed;

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

                velocity += gravity;
            }

            if ((velocity != 0) && (max != 10000))
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

        private collideWorld(obj:IPhysicsShape) {

            //  Collide on the x-axis
            var dx: number = obj.world.bounds.x - (obj.position.x - obj.bounds.halfWidth);
            
            if (0 < dx)
            {
                //  Hit Left
                obj.oH = 1;
                obj.position.x += dx;

                if (obj.sprite.physics.bounce.x > 0)
                {
                    obj.sprite.physics.velocity.x *= -(obj.sprite.physics.bounce.x);
                }
                else
                {
                    obj.sprite.physics.velocity.x = 0;
                }
            }
            else
            {
                dx = (obj.position.x + obj.bounds.halfWidth) - obj.world.bounds.right;

                if (0 < dx)
                {
                    //  Hit Right
                    obj.oH = -1;
                    obj.position.x -= dx;

                    if (obj.sprite.physics.bounce.x > 0)
                    {
                        obj.sprite.physics.velocity.x *= -(obj.sprite.physics.bounce.x);
                    }
                    else
                    {
                        obj.sprite.physics.velocity.x = 0;
                    }
                }
            }

            //  Collide on the y-axis
            var dy: number = obj.world.bounds.y - (obj.position.y - obj.bounds.halfHeight);

            if (0 < dy)
            {
                //  Hit Top
                obj.oV = 1;
                obj.position.y += dy;

                if (obj.sprite.physics.bounce.y > 0)
                {
                    obj.sprite.physics.velocity.y *= -(obj.sprite.physics.bounce.y);
                }
                else
                {
                    obj.sprite.physics.velocity.y = 0;
                }
            }
            else
            {
                dy = (obj.position.y + obj.bounds.halfHeight) - obj.world.bounds.bottom;

                if (0 < dy)
                {
                    //  Hit Bottom
                    obj.oV = -1;
                    obj.position.y -= dy;

                    if (obj.sprite.physics.bounce.y > 0)
                    {
                        obj.sprite.physics.velocity.y *= -(obj.sprite.physics.bounce.y);
                    }
                    else
                    {
                        obj.sprite.physics.velocity.y = 0;
                    }
                }
            }

        }

        /*
        private processWorld(px, py, dx, dy, tile) {

            //  Velocity
            //this.sprite.physics.velocity.x = this.position.x - this.oldPosition.x;
            //this.sprite.physics.velocity.y = this.position.y - this.oldPosition.y;

            //  Optimise!!!
            var dp: number = (this.sprite.physics.velocity.x * dx + this.sprite.physics.velocity.y * dy);
            var nx: number = dp * dx;
            var ny: number = dp * dy;
            var tx: number = this.sprite.physics.velocity.x - nx;
            var ty: number = this.sprite.physics.velocity.y - ny;

            var bx, by, fx, fy;

            if (dp < 0)
            {
                fx = tx * this.sprite.physics.friction.x;
                fy = ty * this.sprite.physics.friction.y;
                bx = (nx * (1 + this.sprite.physics.bounce.x));
                by = (ny * (1 + this.sprite.physics.bounce.y));
                //this.sprite.physics.velocity.x = bx;
                //this.sprite.physics.velocity.y = by;
            }
            else
            {
                bx = by = fx = fy = 0;
            }

            this.position.x += px;
            this.position.y += py;

            this.oldPosition.x += px + bx + fx;
            this.oldPosition.y += py + by + fy;

        }
        */

    }

}