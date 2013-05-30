/// <reference path="../Game.ts" />
/// <reference path="IPhysicsShape.ts" />
/// <reference path="../utils/RectangleUtils.ts" />

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

        public remove(shape: IPhysicsShape) {

            this._length = this._objects.length;

            for (var i = 0; i < this._length; i++)
            {
                if (this._objects[i] === shape)
                {
                    this._objects[i] = null;
                }
            }

        }

        public update() {

            this._length = this._objects.length;

            for (var i = 0; i < this._length; i++)
            {
                if (this._objects[i])
                {
                    this._objects[i].preUpdate();
                    this.updateMotion(this._objects[i]);
                    this.collideWorld(this._objects[i]);

                    if (this._objects[i].physics.immovable == false)
                    {
                        for (var x = 0; x < this._length; x++)
                        {
                            if (this._objects[x] !== this._objects[i])
                            {
                                this.collideShapes(this._objects[i], this._objects[x]);
                            }
                        }
                    }

                }
            }

        }

        public render() {

            //  iterate through the objects here, updating and colliding
            for (var i = 0; i < this._length; i++)
            {
                if (this._objects[i])
                {
                    this._objects[i].render(this.game.stage.context);
                }
            }

        }

        private updateMotion(shape: IPhysicsShape) {

            if (shape.physics.moves == false)
            {
                return;
            }

            /*
            velocityDelta = (this._game.motion.computeVelocity(this.angularVelocity, this.angularAcceleration, this.angularDrag, this.maxAngular) - this.angularVelocity) / 2;
            this.angularVelocity += velocityDelta;
            this._angle += this.angularVelocity * this._game.time.elapsed;
            this.angularVelocity += velocityDelta;
            */

            this._velocityDelta = (this.computeVelocity(shape.physics.velocity.x, shape.physics.gravity.x, shape.physics.acceleration.x, shape.physics.drag.x) - shape.physics.velocity.x) / 2;
            shape.physics.velocity.x += this._velocityDelta;
            this._delta = shape.physics.velocity.x * this.game.time.elapsed;
            shape.physics.velocity.x += this._velocityDelta;
            shape.position.x += this._delta;

            this._velocityDelta = (this.computeVelocity(shape.physics.velocity.y, shape.physics.gravity.y, shape.physics.acceleration.y, shape.physics.drag.y) - shape.physics.velocity.y) / 2;
            shape.physics.velocity.y += this._velocityDelta;
            this._delta = shape.physics.velocity.y * this.game.time.elapsed;
            shape.physics.velocity.y += this._velocityDelta;
            shape.position.y += this._delta;

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

        private collideShapes(shapeA: IPhysicsShape, shapeB: IPhysicsShape) {

            if (shapeA.physics.immovable && shapeB.physics.immovable)
            {
                return;
            }

            //  Simple bounds check first
            if (RectangleUtils.intersects(shapeA.bounds, shapeB.bounds))
            {
                //  Collide on the x-axis
                if (shapeA.bounds.right >= shapeB.bounds.x && shapeA.bounds.right <= shapeB.bounds.right)
                {
                    //  The right side of ShapeA hit the left side of ShapeB
                    this._distance.x = shapeB.bounds.x - shapeA.bounds.right;

                    if (this._distance.x != 0)
                    {
                        this._tangent.setTo(-1, 0);
                        this.separateX(shapeA, shapeB, this._distance, this._tangent);
                    }
                }
                else if (shapeA.bounds.x <= shapeB.bounds.right && shapeA.bounds.x >= shapeB.bounds.x)
                {
                    //  The left side of ShapeA hit the right side of ShapeB
                    this._distance.x = shapeB.bounds.right - shapeA.bounds.x;

                    if (this._distance.x != 0)
                    {
                        this._tangent.setTo(1, 0);
                        this.separateX(shapeA, shapeB, this._distance, this._tangent);
                    }
                }

                //  Collide on the y-axis
                if (shapeA.bounds.y <= shapeB.bounds.bottom && shapeA.bounds.y >= shapeB.bounds.y)
                {
                    console.log(shapeA.bounds.y, shapeB.bounds.bottom, shapeB.bounds.y);
                    //  The top of ShapeA hit the bottom of ShapeB
                    this._distance.y = shapeB.bounds.bottom - shapeA.bounds.y;

                    if (this._distance.y != 0)
                    {
                        this._tangent.setTo(0, 1);
                        this.separateY(shapeA, shapeB, this._distance, this._tangent);
                    }
                }
                else if (shapeA.bounds.bottom >= shapeB.bounds.y && shapeA.bounds.bottom <= shapeB.bounds.bottom)
                {
                    console.log(shapeA.bounds.bottom, shapeB.bounds.y, shapeB.bounds.bottom);
                    //  The bottom of ShapeA hit the top of ShapeB
                    this._distance.y = shapeB.bounds.y - shapeA.bounds.bottom;

                    if (this._distance.y != 0)
                    {
                        this._tangent.setTo(0, -1);
                        this.separateY(shapeA, shapeB, this._distance, this._tangent);
                    }
                }
                
            }

        }

        private collideWorld(shape:IPhysicsShape) {

            //  Collide on the x-axis
            this._distance.x = shape.world.bounds.x - (shape.position.x - shape.bounds.halfWidth);
            
            if (0 < this._distance.x)
            {
                //  Hit Left
                this._tangent.setTo(1, 0);
                this.separateXWall(shape, this._distance, this._tangent);
            }
            else
            {
                this._distance.x = (shape.position.x + shape.bounds.halfWidth) - shape.world.bounds.right;

                if (0 < this._distance.x)
                {
                    //  Hit Right
                    this._tangent.setTo(-1, 0);
                    this._distance.reverse();
                    this.separateXWall(shape, this._distance, this._tangent);
                }
            }

            //  Collide on the y-axis
            this._distance.y = shape.world.bounds.y - (shape.position.y - shape.bounds.halfHeight);

            if (0 < this._distance.y)
            {
                //  Hit Top
                this._tangent.setTo(0, 1);
                this.separateYWall(shape, this._distance, this._tangent);
            }
            else
            {
                this._distance.y = (shape.position.y + shape.bounds.halfHeight) - shape.world.bounds.bottom;

                if (0 < this._distance.y)
                {
                    //  Hit Bottom
                    this._tangent.setTo(0, -1);
                    this._distance.reverse();
                    this.separateYWall(shape, this._distance, this._tangent);
                }
            }

        }

        private separateX(shapeA: IPhysicsShape, shapeB: IPhysicsShape, distance: Vec2, tangent: Vec2) {

            if (tangent.x == 1)
            {
                console.log('The left side of ShapeA hit the right side of ShapeB', distance.x);
                shapeA.physics.touching |= Phaser.Types.LEFT;
                shapeB.physics.touching |= Phaser.Types.RIGHT;
            }
            else
            {
                console.log('The right side of ShapeA hit the left side of ShapeB', distance.x);
                shapeA.physics.touching |= Phaser.Types.RIGHT;
                shapeB.physics.touching |= Phaser.Types.LEFT;
            }

            //  collision edges
            shapeA.oH = tangent.x;

            //  only apply collision response forces if the object is travelling into, and not out of, the collision
            if (Vec2Utils.dot(shapeA.physics.velocity, tangent) < 0)
            {
                //  Apply horizontal bounce
                if (shapeA.physics.bounce.x > 0)
                {
                    shapeA.physics.velocity.x *= -(shapeA.physics.bounce.x);
                }
                else
                {
                    shapeA.physics.velocity.x = 0;
                }
            }

            shapeA.position.x += distance.x;
            shapeA.bounds.x += distance.x;

        }

        private separateY(shapeA: IPhysicsShape, shapeB: IPhysicsShape, distance: Vec2, tangent: Vec2) {

            if (tangent.y == 1)
            {
                console.log('The top of ShapeA hit the bottom of ShapeB', distance.y);
                shapeA.physics.touching |= Phaser.Types.UP;
                shapeB.physics.touching |= Phaser.Types.DOWN;
            }
            else
            {
                console.log('The bottom of ShapeA hit the top of ShapeB', distance.y);
                shapeA.physics.touching |= Phaser.Types.DOWN;
                shapeB.physics.touching |= Phaser.Types.UP;
            }

            //  collision edges
            shapeA.oV = tangent.y;

            //  only apply collision response forces if the object is travelling into, and not out of, the collision
            if (Vec2Utils.dot(shapeA.physics.velocity, tangent) < 0)
            {
                //  Apply horizontal bounce
                if (shapeA.physics.bounce.y > 0)
                {
                    shapeA.physics.velocity.y *= -(shapeA.physics.bounce.y);
                }
                else
                {
                    shapeA.physics.velocity.y = 0;
                }
            }

            shapeA.position.y += distance.y;
            shapeA.bounds.y += distance.y;

        }

        private separateXWall(shapeA: IPhysicsShape, distance: Vec2, tangent: Vec2) {

            if (tangent.x == 1)
            {
                console.log('The left side of ShapeA hit the right side of ShapeB', distance.x);
                shapeA.physics.touching |= Phaser.Types.LEFT;
            }
            else
            {
                console.log('The right side of ShapeA hit the left side of ShapeB', distance.x);
                shapeA.physics.touching |= Phaser.Types.RIGHT;
            }

            //  collision edges
            shapeA.oH = tangent.x;

            //  only apply collision response forces if the object is travelling into, and not out of, the collision
            if (Vec2Utils.dot(shapeA.physics.velocity, tangent) < 0)
            {
                //  Apply horizontal bounce
                if (shapeA.physics.bounce.x > 0)
                {
                    shapeA.physics.velocity.x *= -(shapeA.physics.bounce.x);
                }
                else
                {
                    shapeA.physics.velocity.x = 0;
                }
            }

            shapeA.position.x += distance.x;

        }

        private separateYWall(shapeA: IPhysicsShape, distance: Vec2, tangent: Vec2) {

            if (tangent.y == 1)
            {
                console.log('The top of ShapeA hit the bottom of ShapeB', distance.y);
                shapeA.physics.touching |= Phaser.Types.UP;
            }
            else
            {
                console.log('The bottom of ShapeA hit the top of ShapeB', distance.y);
                shapeA.physics.touching |= Phaser.Types.DOWN;
            }

            //  collision edges
            shapeA.oV = tangent.y;

            //  only apply collision response forces if the object is travelling into, and not out of, the collision
            if (Vec2Utils.dot(shapeA.physics.velocity, tangent) < 0)
            {
                //  Apply horizontal bounce
                if (shapeA.physics.bounce.y > 0)
                {
                    shapeA.physics.velocity.y *= -(shapeA.physics.bounce.y);
                }
                else
                {
                    shapeA.physics.velocity.y = 0;
                }
            }

            shapeA.position.y += distance.y;

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

        /**
         * Checks for overlaps between two objects using the world QuadTree. Can be GameObject vs. GameObject, GameObject vs. Group or Group vs. Group.
         * Note: Does not take the objects scrollFactor into account. All overlaps are check in world space.
         * @param object1 The first GameObject or Group to check. If null the world.group is used.
         * @param object2 The second GameObject or Group to check.
         * @param notifyCallback A callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you passed them to Collision.overlap.
         * @param processCallback A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then notifyCallback will only be called if processCallback returns true.
         * @param context The context in which the callbacks will be called
         * @returns {boolean} true if the objects overlap, otherwise false.
         */
        /*
        public overlap(object1: Basic = null, object2: Basic = null, notifyCallback = null, processCallback = null, context = null): bool {

            if (object1 == null)
            {
                object1 = this._game.world.group;
            }

            if (object2 == object1)
            {
                object2 = null;
            }

            QuadTree.divisions = this._game.world.worldDivisions;

            var quadTree: QuadTree = new QuadTree(this._game.world.bounds.x, this._game.world.bounds.y, this._game.world.bounds.width, this._game.world.bounds.height);

            quadTree.load(object1, object2, notifyCallback, processCallback, context);

            var result: bool = quadTree.execute();

            quadTree.destroy();

            quadTree = null;

            return result;

        }
        */


    }

}