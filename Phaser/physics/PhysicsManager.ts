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

                    for (var x = 0; x < this._length; x++)
                    {
                        if (this._objects[x] && this._objects[x] !== this._objects[i])
                        {
                            //this.collideShapes(this._objects[i], this._objects[x]);
                            var r = this.NEWseparate(this._objects[i], this._objects[x]);
                            //console.log('sep', r);
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

            this._distance.setTo(0, 0);
            this._tangent.setTo(0, 0);

            //  Simple bounds check first
            if (RectangleUtils.intersects(shapeA.bounds, shapeB.bounds))
            {
                //  Collide on the x-axis
                if (shapeA.physics.velocity.x > 0 && shapeA.bounds.right > shapeB.bounds.x && shapeA.bounds.right <= shapeB.bounds.right)
                {
                    //  The right side of ShapeA hit the left side of ShapeB
                    this._distance.x = shapeB.bounds.x - shapeA.bounds.right;

                    if (this._distance.x != 0)
                    {
                        this._tangent.x = -1;
                    }
                }
                else if (shapeA.physics.velocity.x < 0 && shapeA.bounds.x < shapeB.bounds.right && shapeA.bounds.x >= shapeB.bounds.x)
                {
                    //  The left side of ShapeA hit the right side of ShapeB
                    this._distance.x = shapeB.bounds.right - shapeA.bounds.x;

                    if (this._distance.x != 0)
                    {
                        this._tangent.x = 1;
                    }
                }

                //  Collide on the y-axis
                if (shapeA.physics.velocity.y < 0 && shapeA.bounds.y < shapeB.bounds.bottom && shapeA.bounds.y > shapeB.bounds.y)
                {
                    console.log('top A -> bot B');
                    //  The top of ShapeA hit the bottom of ShapeB
                    this._distance.y = shapeB.bounds.bottom - shapeA.bounds.y;
                    console.log(shapeA.bounds, shapeB.bounds, this._distance.y);

                    if (this._distance.y != 0)
                    {
                        this._tangent.y = 1;
                    }
                }
                else if (shapeA.physics.velocity.y > 0 && shapeA.bounds.bottom > shapeB.bounds.y && shapeA.bounds.bottom < shapeB.bounds.bottom)
                {
                    //  The bottom of ShapeA hit the top of ShapeB
                    this._distance.y = shapeB.bounds.y - shapeA.bounds.bottom;

                    if (this._distance.y != 0)
                    {
                        this._tangent.y = -1;
                    }
                }

                //  Separate
                if (this._distance.equals(0) == false)
                {
                    //this.separate(shapeA, shapeB, this._distance, this._tangent);
                }
            }

        }

        /**
         * The core Collision separation function used by Collision.overlap.
         * @param object1 The first GameObject to separate
         * @param object2 The second GameObject to separate
         * @returns {boolean} Returns true if the objects were separated, otherwise false.
         */
        public NEWseparate(object1, object2): bool {

            var separatedX: bool = this.separateSpriteToSpriteX(object1, object2);
            var separatedY: bool = this.separateSpriteToSpriteY(object1, object2);

            return separatedX || separatedY;

        }

        private checkHullIntersection(shape1:IPhysicsShape, shape2:IPhysicsShape): bool {

            //if ((shape1.hullX + shape1.hullWidth > shape2.hullX) && (shape1.hullX < shape2.hullX + shape2.bounds.width) && (shape1.hullY + shape1.hullHeight > shape2.hullY) && (shape1.hullY < shape2.hullY + shape2.hullHeight))
            //  maybe not bounds.width?
            if ((shape1.hullX + shape1.hullWidth > shape2.hullX) && (shape1.hullX < shape2.hullX + shape2.hullWidth) && (shape1.hullY + shape1.hullHeight > shape2.hullY) && (shape1.hullY < shape2.hullY + shape2.hullHeight))
            {
                return true;
            }
            else
            {
                return false;
            }

        }

        /**
         * Separates the two objects on their x axis
         * @param object1 The first GameObject to separate
         * @param object2 The second GameObject to separate
         * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
         */
        public separateSpriteToSpriteX(object1:Sprite, object2:Sprite): bool {

            //  Can't separate two immovable objects
            if (object1.physics.immovable && object2.physics.immovable)
            {
                return false;
            }

            //  First, get the two object deltas
            var overlap: number = 0;

            if (object1.physics.shape.deltaX != object2.physics.shape.deltaX)
            {
                if (RectangleUtils.intersects(object1.physics.shape.bounds, object2.physics.shape.bounds))
                {
                    //var maxOverlap: number = object1.physics.shape.deltaXAbs + object2.physics.shape.deltaXAbs + Collision.OVERLAP_BIAS;
                    var maxOverlap: number = object1.physics.shape.deltaXAbs + object2.physics.shape.deltaXAbs + 4;

                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if (object1.physics.shape.deltaX > object2.physics.shape.deltaX)
                    {
                        overlap = object1.physics.shape.bounds.right - object2.physics.shape.bounds.x;

                        if ((overlap > maxOverlap) || !(object1.physics.allowCollisions & Phaser.Types.RIGHT) || !(object2.physics.allowCollisions & Phaser.Types.LEFT))
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object1.physics.touching |= Phaser.Types.RIGHT;
                            object2.physics.touching |= Phaser.Types.LEFT;
                        }
                    }
                    else if (object1.physics.shape.deltaX < object2.physics.shape.deltaX)
                    {
                        overlap = object1.physics.shape.bounds.x - object2.physics.shape.bounds.width - object2.physics.shape.bounds.x;

                        if ((-overlap > maxOverlap) || !(object1.physics.allowCollisions & Phaser.Types.LEFT) || !(object2.physics.allowCollisions & Phaser.Types.RIGHT))
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object1.physics.touching |= Phaser.Types.LEFT;
                            object2.physics.touching |= Phaser.Types.RIGHT;
                        }
                    }
                }
            }

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (overlap != 0)
            {
                var obj1Velocity: number = object1.physics.velocity.x;
                var obj2Velocity: number = object2.physics.velocity.x;

                if (!object1.physics.immovable && !object2.physics.immovable)
                {
                    overlap *= 0.5;
                    object1.physics.shape.position.x = object1.physics.shape.position.x - overlap;
                    object2.physics.shape.position.x += overlap;

                    var obj1NewVelocity: number = Math.sqrt((obj2Velocity * obj2Velocity * object2.physics.mass) / object1.physics.mass) * ((obj2Velocity > 0) ? 1 : -1);
                    var obj2NewVelocity: number = Math.sqrt((obj1Velocity * obj1Velocity * object1.physics.mass) / object2.physics.mass) * ((obj1Velocity > 0) ? 1 : -1);
                    var average: number = (obj1NewVelocity + obj2NewVelocity) * 0.5;
                    obj1NewVelocity -= average;
                    obj2NewVelocity -= average;
                    object1.physics.velocity.x = average + obj1NewVelocity * object1.physics.bounce.x;
                    object2.physics.velocity.x = average + obj2NewVelocity * object2.physics.bounce.x;
                }
                else if (!object1.physics.immovable)
                {
                    overlap *= 2;
                    object1.physics.shape.position.x -= overlap;
                    object1.physics.velocity.x = obj2Velocity - obj1Velocity * object1.physics.bounce.x;
                }
                else if (!object2.physics.immovable)
                {
                    overlap *= 2;
                    object2.physics.shape.position.x += overlap;
                    object2.physics.velocity.x = obj1Velocity - obj2Velocity * object2.physics.bounce.x;
                }

                return true;
            }
            else
            {
                return false;
            }

        }

        /**
         * Separates the two objects on their y axis
         * @param object1 The first GameObject to separate
         * @param object2 The second GameObject to separate
         * @returns {boolean} Whether the objects in fact touched and were separated along the Y axis.
         */
        public separateSpriteToSpriteY(object1:Sprite, object2:Sprite): bool {

            //  Can't separate two immovable objects
            if (object1.physics.immovable && object2.physics.immovable) {
                return false;
            }

            //  First, get the two object deltas
            var overlap: number = 0;

            if (object1.physics.shape.deltaY != object2.physics.shape.deltaY)
            {
                if (RectangleUtils.intersects(object1.physics.shape.bounds, object2.physics.shape.bounds))
                {
                    //  This is the only place to use the DeltaAbs values
                    //var maxOverlap: number = object1.physics.shape.deltaYAbs + object2.physics.shape.deltaYAbs + Phaser.Types.OVERLAP_BIAS;
                    var maxOverlap: number = object1.physics.shape.deltaYAbs + object2.physics.shape.deltaYAbs + 4;

                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if (object1.physics.shape.deltaY > object2.physics.shape.deltaY)
                    {
                        overlap = object1.physics.shape.bounds.bottom - object2.physics.shape.bounds.y;

                        if ((overlap > maxOverlap) || !(object1.physics.allowCollisions & Phaser.Types.DOWN) || !(object2.physics.allowCollisions & Phaser.Types.UP))
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object1.physics.touching |= Phaser.Types.DOWN;
                            object2.physics.touching |= Phaser.Types.UP;
                        }
                    }
                    else if (object1.physics.shape.deltaY < object2.physics.shape.deltaY)
                    {
                        overlap = object1.physics.shape.bounds.y - object2.physics.shape.bounds.height - object2.physics.shape.bounds.y;

                        if ((-overlap > maxOverlap) || !(object1.physics.allowCollisions & Phaser.Types.UP) || !(object2.physics.allowCollisions & Phaser.Types.DOWN))
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object1.physics.touching |= Phaser.Types.UP;
                            object2.physics.touching |= Phaser.Types.DOWN;
                        }
                    }
                }
            }

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (overlap != 0)
            {
                var obj1Velocity: number = object1.physics.velocity.y;
                var obj2Velocity: number = object2.physics.velocity.y;

                if (!object1.physics.immovable && !object2.physics.immovable)
                {
                    overlap *= 0.5;
                    object1.physics.shape.position.y = object1.physics.shape.position.y - overlap;
                    object2.physics.shape.position.y += overlap;

                    var obj1NewVelocity: number = Math.sqrt((obj2Velocity * obj2Velocity * object2.physics.mass) / object1.physics.mass) * ((obj2Velocity > 0) ? 1 : -1);
                    var obj2NewVelocity: number = Math.sqrt((obj1Velocity * obj1Velocity * object1.physics.mass) / object2.physics.mass) * ((obj1Velocity > 0) ? 1 : -1);
                    var average: number = (obj1NewVelocity + obj2NewVelocity) * 0.5;
                    obj1NewVelocity -= average;
                    obj2NewVelocity -= average;
                    object1.physics.velocity.y = average + obj1NewVelocity * object1.physics.bounce.y;
                    object2.physics.velocity.y = average + obj2NewVelocity * object2.physics.bounce.y;
                }
                else if (!object1.physics.immovable)
                {
                    overlap *= 2;
                    object1.physics.shape.position.y -= overlap;
                    object1.physics.velocity.y = obj2Velocity - obj1Velocity * object1.physics.bounce.y;
                    //  This is special case code that handles things like horizontal moving platforms you can ride
                    if (object2.active && object2.physics.moves && (object1.physics.shape.deltaY > object2.physics.shape.deltaY))
                    {
                        object1.physics.shape.position.x += object2.physics.shape.position.x - object2.physics.shape.oldPosition.x;
                    }
                }
                else if (!object2.physics.immovable)
                {
                    overlap *= 2;
                    object2.physics.shape.position.y += overlap;
                    object2.physics.velocity.y = obj1Velocity - obj2Velocity * object2.physics.bounce.y;
                    //  This is special case code that handles things like horizontal moving platforms you can ride
                    if (object1.active && object1.physics.moves && (object1.physics.shape.deltaY < object2.physics.shape.deltaY))
                    {
                        object2.physics.shape.position.x += object1.physics.shape.position.x - object1.physics.shape.oldPosition.x;
                    }
                }

                return true;
            }
            else
            {
                return false;
            }
        }








        private separate(shapeA: IPhysicsShape, shapeB: IPhysicsShape, distance: Vec2, tangent: Vec2) {

            if (tangent.x == 1)
            {
                console.log('1 The left side of ShapeA hit the right side of ShapeB', Math.floor(distance.x));
                shapeA.physics.touching |= Phaser.Types.LEFT;
                shapeB.physics.touching |= Phaser.Types.RIGHT;
            }
            else if (tangent.x == -1)
            {
                console.log('2 The right side of ShapeA hit the left side of ShapeB', Math.floor(distance.x));
                shapeA.physics.touching |= Phaser.Types.RIGHT;
                shapeB.physics.touching |= Phaser.Types.LEFT;
            }

            if (tangent.y == 1)
            {
                console.log('3 The top of ShapeA hit the bottom of ShapeB', Math.floor(distance.y));
                shapeA.physics.touching |= Phaser.Types.UP;
                shapeB.physics.touching |= Phaser.Types.DOWN;
            }
            else if (tangent.y == -1)
            {
                console.log('4 The bottom of ShapeA hit the top of ShapeB', Math.floor(distance.y));
                shapeA.physics.touching |= Phaser.Types.DOWN;
                shapeB.physics.touching |= Phaser.Types.UP;
            }


            //  only apply collision response forces if the object is travelling into, and not out of, the collision
            var dot = Vec2Utils.dot(shapeA.physics.velocity, tangent);

            if (dot < 0)
            {
                console.log('in to', dot);

                //  Apply horizontal bounce
                if (shapeA.physics.bounce.x > 0)
                {
                    shapeA.physics.velocity.x *= -(shapeA.physics.bounce.x);
                }
                else
                {
                    shapeA.physics.velocity.x = 0;
                }
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
            else
            {
                console.log('out of', dot);
            }

            shapeA.position.x += Math.floor(distance.x);
            //shapeA.bounds.x += Math.floor(distance.x);

            shapeA.position.y += Math.floor(distance.y);
            //shapeA.bounds.y += distance.y;
                
            console.log('------------------------------------------------');

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
            //shapeA.oH = tangent.x;

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
            //shapeA.oV = tangent.y;

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
            //shapeA.oH = tangent.x;

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
            //shapeA.oV = tangent.y;

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

        private OLDseparate(shape:IPhysicsShape, distance: Vec2, tangent: Vec2) {

            //  collision edges
            //shape.oH = tangent.x;
            //shape.oV = tangent.y;

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