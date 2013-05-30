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

            this._distance = new Vec2;
            this._tangent = new Vec2;

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
        private _distance: Vec2;
        private _tangent: Vec2;

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

        private collideWorld(shape:IPhysicsShape) {

            //  Collide on the x-axis
            this._distance.x = shape.world.bounds.x - (shape.position.x - shape.bounds.halfWidth);
            
            if (0 < this._distance.x)
            {
                //  Hit Left
                this._tangent.setTo(1, 0);
                this.separateX(shape, this._distance, this._tangent);
            }
            else
            {
                this._distance.x = (shape.position.x + shape.bounds.halfWidth) - shape.world.bounds.right;

                if (0 < this._distance.x)
                {
                    //  Hit Right
                    this._tangent.setTo(-1, 0);
                    this._distance.reverse();
                    this.separateX(shape, this._distance, this._tangent);
                }
            }

            //  Collide on the y-axis
            this._distance.y = shape.world.bounds.y - (shape.position.y - shape.bounds.halfHeight);

            if (0 < this._distance.y)
            {
                //  Hit Top
                this._tangent.setTo(0, 1);
                this.separateY(shape, this._distance, this._tangent);
            }
            else
            {
                this._distance.y = (shape.position.y + shape.bounds.halfHeight) - shape.world.bounds.bottom;

                if (0 < this._distance.y)
                {
                    //  Hit Bottom
                    this._tangent.setTo(0, -1);
                    this._distance.reverse();
                    this.separateY(shape, this._distance, this._tangent);
                }
            }

        }

        /*
        private OLDButWorkingcollideWorld(obj:IPhysicsShape) {

            this._distance.setTo(0, 0);

            //  Collide on the x-axis
            this._distance.x = obj.world.bounds.x - (obj.position.x - obj.bounds.halfWidth);
            
            if (0 < this._distance.x)
            {
                //  Hit Left
                //  Parameter order: px, py (distance), dx, dy (tangent)
                this._tangent.setTo(1, 0);
                this.separate(obj, this._distance, this._tangent);
            }
            else
            {
                this._distance.x = (obj.position.x + obj.bounds.halfWidth) - obj.world.bounds.right;

                if (0 < this._distance.x)
                {
                    //  Hit Right
                    //  Parameter order: px, py (distance), dx, dy (tangent)
                    this._tangent.setTo(-1, 0);
                    this._distance.x = -this._distance.x;
                    this.separate(obj, this._distance, this._tangent);
                }
            }

            //  Collide on the y-axis
            this._distance.x = 0;
            this._distance.y = obj.world.bounds.y - (obj.position.y - obj.bounds.halfHeight);

            if (0 < this._distance.y)
            {
                //  Hit Top
                this._tangent.setTo(0, 1);
                this.separate(obj, this._distance, this._tangent);
            }
            else
            {
                this._distance.y = (obj.position.y + obj.bounds.halfHeight) - obj.world.bounds.bottom;

                if (0 < this._distance.y)
                {
                    //  Hit Bottom
                    this._tangent.setTo(0, -1);
                    this._distance.y = -this._distance.y;
                    this.separate(obj, this._distance, this._tangent);
                }
            }

        }
    */

        private separateX(shape: IPhysicsShape, distance: Vec2, tangent: Vec2) {

            //  collision edges
            shape.oH = tangent.x;

            //  only apply collision response forces if the object is travelling into, and not out of, the collision
            if (Vec2Utils.dot(shape.physics.velocity, tangent) < 0)
            {
                //  Apply horizontal bounce
                if (shape.physics.bounce.x > 0)
                {
                    shape.physics.velocity.x *= -(shape.physics.bounce.x);
                }
                else
                {
                    shape.physics.velocity.x = 0;
                }
            }

            shape.position.x += distance.x;

        }

        private separateY(shape: IPhysicsShape, distance: Vec2, tangent: Vec2) {

            //  collision edges
            shape.oV = tangent.y;

            //  only apply collision response forces if the object is travelling into, and not out of, the collision
            if (Vec2Utils.dot(shape.physics.velocity, tangent) < 0)
            {
                //  Apply horizontal bounce
                if (shape.physics.bounce.y > 0)
                {
                    shape.physics.velocity.y *= -(shape.physics.bounce.y);
                }
                else
                {
                    shape.physics.velocity.y = 0;
                }
            }

            shape.position.y += distance.y;

        }

        private separate(shape:IPhysicsShape, distance: Vec2, tangent: Vec2) {

            //  collision edges
            shape.oH = tangent.x;
            shape.oV = tangent.y;

            //  Velocity (move to temp vars)

            //  was vx/vy
            var velocity: Vec2 = Vec2Utils.subtract(shape.position, shape.oldPosition);

            //  was dp
            var dot: number = Vec2Utils.dot(shape.physics.velocity, tangent);

            //  project velocity onto the collision normal
            //  was nx/ny
            tangent.multiplyByScalar(dot);

            //  was tx/ty (tangent velocity?)
            var tangentVelocity: Vec2 = Vec2Utils.subtract(velocity, tangent);

            //  only apply collision response forces if the object is travelling into, and not out of, the collision
            if (dot < 0)
            {
                //  Apply horizontal bounce
                if (distance.x != 0)
                {
                    if (shape.physics.bounce.x > 0)
                    {
                        shape.physics.velocity.x *= -(shape.physics.bounce.x);
                    }
                    else
                    {
                        shape.physics.velocity.x = 0;
                    }
                }

                //  Apply vertical bounce
                if (distance.y != 0)
                {
                    if (shape.physics.bounce.y > 0)
                    {
                        shape.physics.velocity.y *= -(shape.physics.bounce.y);
                    }
                    else
                    {
                        shape.physics.velocity.y = 0;
                    }
                }
            }
            else
            {
                //  moving out of collision
            }

            //  project object out of collision
            //console.log('proj out', distance.x, distance.y,'dot',dot);
            shape.position.add(distance);

        }

    }

}