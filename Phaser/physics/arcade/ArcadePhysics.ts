/// <reference path="../../Game.ts" />
/// <reference path="../../utils/RectangleUtils.ts" />
/// <reference path="../../utils/CircleUtils.ts" />
/// <reference path="Body.ts" />
/// <reference path="../../math/QuadTree.ts" />

/**
* Phaser - ArcadePhysics Manager
*
*/

module Phaser.Physics {

    export class ArcadePhysics {

        constructor(game: Game, width: number, height: number) {

            this.game = game;

            this.gravity = new Vec2;
            this.drag = new Vec2;
            this.bounce = new Vec2;
            this.angularDrag = 0;

            this.bounds = new Rectangle(0, 0, width, height); 

            this._distance = new Vec2;
            this._tangent = new Vec2;

            //this.members = new Group(game);

        }

        /**
         * Local reference to Game.
         */
        public game: Game;

        /**
         * Physics object pool
         */
        public members: Group;

        //  Temp calculation vars
        private _drag: number;
        private _delta: number;
        private _velocityDelta: number;
        private _length: number = 0;
        private _distance: Vec2;
        private _tangent: Vec2;
        private _separatedX: boolean;
        private _separatedY: boolean;
        private _overlap: number;
        private _maxOverlap: number;
        private _obj1Velocity: number;
        private _obj2Velocity: number;
        private _obj1NewVelocity: number;
        private _obj2NewVelocity: number;
        private _average: number;
        private _quadTree: QuadTree;
        private _quadTreeResult: boolean;

        public bounds: Rectangle;

        public gravity: Vec2;
        public drag: Vec2;
        public bounce: Vec2;
        public angularDrag: number;

        /**
         * The overlap bias is used when calculating hull overlap before separation - change it if you have especially small or large GameObjects
         * @type {number}
         */
        static OVERLAP_BIAS: number = 4;

        /**
         * The overlap bias is used when calculating hull overlap before separation - change it if you have especially small or large GameObjects
         * @type {number}
         */
        static TILE_OVERLAP: boolean = false;

        /**
         * @type {number}
         */
        public worldDivisions: number = 6;


        /*
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
*/

        public updateMotion(body: Phaser.Physics.Body) {

            if (body.type == Types.BODY_DISABLED)
            {
                return;
            }

            this._velocityDelta  = (this.computeVelocity(body.angularVelocity, body.gravity.x, body.angularAcceleration, body.angularDrag, body.maxAngular) - body.angularVelocity) / 2;
            body.angularVelocity += this._velocityDelta;
            body.sprite.transform.rotation += body.angularVelocity * this.game.time.elapsed;
            body.angularVelocity += this._velocityDelta;

            this._velocityDelta = (this.computeVelocity(body.velocity.x, body.gravity.x, body.acceleration.x, body.drag.x) - body.velocity.x) / 2;
            body.velocity.x += this._velocityDelta;
            this._delta = body.velocity.x * this.game.time.elapsed;
            body.velocity.x += this._velocityDelta;
            //body.position.x += this._delta;
            body.sprite.x += this._delta;

            this._velocityDelta = (this.computeVelocity(body.velocity.y, body.gravity.y, body.acceleration.y, body.drag.y) - body.velocity.y) / 2;
            body.velocity.y += this._velocityDelta;
            this._delta = body.velocity.y * this.game.time.elapsed;
            body.velocity.y += this._velocityDelta;
            //body.position.y += this._delta;
            body.sprite.y += this._delta;

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

        /**
         * The core Collision separation method.
         * @param body1 The first Physics.Body to separate
         * @param body2 The second Physics.Body to separate
         * @returns {boolean} Returns true if the bodies were separated, otherwise false.
         */
        public separate(body1: Body, body2: Body): boolean {

            this._separatedX = this.separateBodyX(body1, body2);
            this._separatedY = this.separateBodyY(body1, body2);

            return this._separatedX || this._separatedY;

        }

        public checkHullIntersection(body1: Body, body2:Body): boolean {
            return ((body1.hullX + body1.hullWidth > body2.hullX) && (body1.hullX < body2.hullX + body2.hullWidth) && (body1.hullY + body1.hullHeight > body2.hullY) && (body1.hullY < body2.hullY + body2.hullHeight));
        }

        /**
         * Separates the two objects on their x axis
         * @param object1 The first GameObject to separate
         * @param object2 The second GameObject to separate
         * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
         */
        public separateBodyX(body1: Body, body2: Body): boolean {

            //  Can't separate two disabled or static objects
            if ((body1.type == Types.BODY_DISABLED || body1.type == Types.BODY_STATIC) && (body2.type == Types.BODY_DISABLED || body2.type == Types.BODY_STATIC))
            {
                return false;
            }

            //  First, get the two object deltas
            this._overlap = 0;

            if (body1.deltaX != body2.deltaX)
            {
                if (RectangleUtils.intersects(body1.bounds, body2.bounds))
                {
                    this._maxOverlap = body1.deltaXAbs + body2.deltaXAbs + ArcadePhysics.OVERLAP_BIAS;

                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if (body1.deltaX > body2.deltaX)
                    {
                        this._overlap = body1.bounds.right - body2.bounds.x;

                        if ((this._overlap > this._maxOverlap) || !(body1.allowCollisions & Types.RIGHT) || !(body2.allowCollisions & Types.LEFT))
                        {
                            this._overlap = 0;
                        }
                        else
                        {
                            body1.touching |= Types.RIGHT;
                            body2.touching |= Types.LEFT;
                        }
                    }
                    else if (body1.deltaX < body2.deltaX)
                    {
                        this._overlap = body1.bounds.x - body2.bounds.width - body2.bounds.x;

                        if ((-this._overlap > this._maxOverlap) || !(body1.allowCollisions & Types.LEFT) || !(body2.allowCollisions & Types.RIGHT))
                        {
                            this._overlap = 0;
                        }
                        else
                        {
                            body1.touching |= Types.LEFT;
                            body2.touching |= Types.RIGHT;
                        }
                    }
                }
            }

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (this._overlap != 0)
            {
                this._obj1Velocity = body1.velocity.x;
                this._obj2Velocity = body2.velocity.x;

                /**
                 * Dynamic = gives and receives impacts
                 * Static = gives but doesn't receive impacts, cannot be moved by physics
                 * Kinematic = gives impacts, but never receives, can be moved by physics
                 */

                //  2 dynamic bodies will exchange velocities
                if (body1.type == Types.BODY_DYNAMIC && body2.type == Types.BODY_DYNAMIC)
                {
                    this._overlap *= 0.5;
                    body1.position.x = body1.position.x - this._overlap;
                    body2.position.x += this._overlap;

                    this._obj1NewVelocity = Math.sqrt((this._obj2Velocity * this._obj2Velocity * body2.mass) / body1.mass) * ((this._obj2Velocity > 0) ? 1 : -1);
                    this._obj2NewVelocity = Math.sqrt((this._obj1Velocity * this._obj1Velocity * body1.mass) / body2.mass) * ((this._obj1Velocity > 0) ? 1 : -1);
                    this._average = (this._obj1NewVelocity + this._obj2NewVelocity) * 0.5;
                    this._obj1NewVelocity -= this._average;
                    this._obj2NewVelocity -= this._average;
                    body1.velocity.x = this._average + this._obj1NewVelocity * body1.bounce.x;
                    body2.velocity.x = this._average + this._obj2NewVelocity * body2.bounce.x;
                }
                else if (body2.type != Types.BODY_DYNAMIC)
                {
                    //  Body 2 is Static or Kinematic
                    this._overlap *= 2;
                    body1.position.x -= this._overlap;
                    body1.velocity.x = this._obj2Velocity - this._obj1Velocity * body1.bounce.x;
                }
                else if (body1.type != Types.BODY_DYNAMIC)
                {
                    //  Body 1 is Static or Kinematic
                    this._overlap *= 2;
                    body2.position.x += this._overlap;
                    body2.velocity.x = this._obj1Velocity - this._obj2Velocity * body2.bounce.x;
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
        public separateBodyY(body1: Body, body2: Body): boolean {

            //  Can't separate two immovable objects
            if ((body1.type == Types.BODY_DISABLED || body1.type == Types.BODY_STATIC) && (body2.type == Types.BODY_DISABLED || body2.type == Types.BODY_STATIC))
            {
                return false;
            }

            //  First, get the two object deltas
            this._overlap = 0;

            if (body1.deltaY != body2.deltaY)
            {
                if (RectangleUtils.intersects(body1.bounds, body2.bounds))
                {
                    //  This is the only place to use the DeltaAbs values
                    this._maxOverlap = body1.deltaYAbs + body2.deltaYAbs + ArcadePhysics.OVERLAP_BIAS;

                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if (body1.deltaY > body2.deltaY)
                    {
                        this._overlap = body1.bounds.bottom - body2.bounds.y;

                        if ((this._overlap > this._maxOverlap) || !(body1.allowCollisions & Types.DOWN) || !(body2.allowCollisions & Types.UP))
                        {
                            this._overlap = 0;
                        }
                        else
                        {
                            body1.touching |= Types.DOWN;
                            body2.touching |= Types.UP;
                        }
                    }
                    else if (body1.deltaY < body2.deltaY)
                    {
                        this._overlap = body1.bounds.y - body2.bounds.height - body2.bounds.y;

                        if ((-this._overlap > this._maxOverlap) || !(body1.allowCollisions & Types.UP) || !(body2.allowCollisions & Types.DOWN))
                        {
                            this._overlap = 0;
                        }
                        else
                        {
                            body1.touching |= Types.UP;
                            body2.touching |= Types.DOWN;
                        }
                    }
                }
            }

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (this._overlap != 0)
            {
                this._obj1Velocity = body1.velocity.y;
                this._obj2Velocity = body2.velocity.y;

                /**
                 * Dynamic = gives and receives impacts
                 * Static = gives but doesn't receive impacts, cannot be moved by physics
                 * Kinematic = gives impacts, but never receives, can be moved by physics
                 */

                if (body1.type == Types.BODY_DYNAMIC && body2.type == Types.BODY_DYNAMIC)
                {
                    this._overlap *= 0.5;
                    body1.position.y = body1.position.y - this._overlap;
                    body2.position.y += this._overlap;

                    this._obj1NewVelocity = Math.sqrt((this._obj2Velocity * this._obj2Velocity * body2.mass) / body1.mass) * ((this._obj2Velocity > 0) ? 1 : -1);
                    this._obj2NewVelocity = Math.sqrt((this._obj1Velocity * this._obj1Velocity * body1.mass) / body2.mass) * ((this._obj1Velocity > 0) ? 1 : -1);
                    var average: number = (this._obj1NewVelocity + this._obj2NewVelocity) * 0.5;
                    this._obj1NewVelocity -= average;
                    this._obj2NewVelocity -= average;
                    body1.velocity.y = average + this._obj1NewVelocity * body1.bounce.y;
                    body2.velocity.y = average + this._obj2NewVelocity * body2.bounce.y;
                }
                else if (body2.type != Types.BODY_DYNAMIC)
                {
                    this._overlap *= 2;
                    body1.position.y -= this._overlap;
                    body1.velocity.y = this._obj2Velocity - this._obj1Velocity * body1.bounce.y;
                    //  This is special case code that handles things like horizontal moving platforms you can ride
                    //if (body2.parent.active && body2.moves && (body1.deltaY > body2.deltaY))
                    if (body2.sprite.active && (body1.deltaY > body2.deltaY))
                    {
                        body1.position.x += body2.position.x - body2.oldPosition.x;
                    }
                }
                else if (body1.type != Types.BODY_DYNAMIC)
                {
                    this._overlap *= 2;
                    body2.position.y += this._overlap;
                    body2.velocity.y = this._obj1Velocity - this._obj2Velocity * body2.bounce.y;
                    //  This is special case code that handles things like horizontal moving platforms you can ride
                    //if (object1.active && body1.moves && (body1.deltaY < body2.deltaY))
                    if (body1.sprite.active && (body1.deltaY < body2.deltaY))
                    {
                        body2.position.x += body1.position.x - body1.oldPosition.x;
                    }
                }

                return true;
            }
            else
            {
                return false;
            }
        }







        /*
        private TILEseparate(shapeA: IPhysicsShape, shapeB: IPhysicsShape, distance: Vec2, tangent: Vec2) {

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
        */

        /**
         * Checks for overlaps between two objects using the world QuadTree. Can be Sprite vs. Sprite, Sprite vs. Group or Group vs. Group.
         * Note: Does not take the objects scrollFactor into account. All overlaps are check in world space.
         * @param object1 The first Sprite or Group to check. If null the world.group is used.
         * @param object2 The second Sprite or Group to check.
         * @param notifyCallback A callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you passed them to Collision.overlap.
         * @param processCallback A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then notifyCallback will only be called if processCallback returns true.
         * @param context The context in which the callbacks will be called
         * @returns {boolean} true if the objects overlap, otherwise false.
         */
        public overlap(object1 = null, object2 = null, notifyCallback = null, processCallback = null, context = null): boolean {

            /*
            if (object1 == null)
            {
                object1 = this.game.world.group;
            }

            if (object2 == object1)
            {
                object2 = null;
            }

            QuadTree.divisions = this.worldDivisions;

            this._quadTree = new Phaser.QuadTree(this, this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);

            this._quadTree.load(object1, object2, notifyCallback, processCallback, context);

            this._quadTreeResult = this._quadTree.execute();

            console.log('over', this._quadTreeResult);

            this._quadTree.destroy();

            this._quadTree = null;

            return this._quadTreeResult;
            */

            return false;

        }






        /**
         * Collision resolution specifically for GameObjects vs. Tiles.
         * @param object The GameObject to separate
         * @param tile The Tile to separate
         * @returns {boolean} Whether the objects in fact touched and were separated
         */
        public separateTile(object:Sprite, x: number, y: number, width: number, height: number, mass: number, collideLeft: boolean, collideRight: boolean, collideUp: boolean, collideDown: boolean, separateX: boolean, separateY: boolean): boolean {

            //var separatedX: boolean = this.separateTileX(object, x, y, width, height, mass, collideLeft, collideRight, separateX);
            //var separatedY: boolean = this.separateTileY(object, x, y, width, height, mass, collideUp, collideDown, separateY);

            //return separatedX || separatedY;

            return false;

        }

        /**
         * Separates the two objects on their x axis
         * @param object The GameObject to separate
         * @param tile The Tile to separate
         * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
         */
        /*
        public separateTileX(object:Sprite, x: number, y: number, width: number, height: number, mass: number, collideLeft: boolean, collideRight: boolean, separate: boolean): boolean {

            //  Can't separate two immovable objects (tiles are always immovable)
            if (object.immovable)
            {
                return false;
            }

            //  First, get the object delta
            var overlap: number = 0;
            var objDelta: number = object.x - object.last.x;
            //var objDelta: number = object.collisionMask.deltaX;

            if (objDelta != 0)
            {
                //  Check if the X hulls actually overlap
                var objDeltaAbs: number = (objDelta > 0) ? objDelta : -objDelta;
                //var objDeltaAbs: number = object.collisionMask.deltaXAbs;
                var objBounds: Rectangle = new Rectangle(object.x - ((objDelta > 0) ? objDelta : 0), object.last.y, object.width + ((objDelta > 0) ? objDelta : -objDelta), object.height);

                if ((objBounds.x + objBounds.width > x) && (objBounds.x < x + width) && (objBounds.y + objBounds.height > y) && (objBounds.y < y + height))
                {
                    var maxOverlap: number = objDeltaAbs + Collision.OVERLAP_BIAS;

                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if (objDelta > 0)
                    {
                        overlap = object.x + object.width - x;

                        if ((overlap > maxOverlap) || !(object.allowCollisions & Collision.RIGHT) || collideLeft == false)
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object.touching |= Collision.RIGHT;
                        }
                    }
                    else if (objDelta < 0)
                    {
                        overlap = object.x - width - x;

                        if ((-overlap > maxOverlap) || !(object.allowCollisions & Collision.LEFT) || collideRight == false)
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object.touching |= Collision.LEFT;
                        }

                    }

                }
            }

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (overlap != 0)
            {
                if (separate == true)
                {
                    //console.log('
                    object.x = object.x - overlap;
                    object.velocity.x = -(object.velocity.x * object.elasticity);
                }

                Collision.TILE_OVERLAP = true;
                return true;
            }
            else
            {
                return false;
            }

        }
        */

        /**
         * Separates the two objects on their y axis
         * @param object The first GameObject to separate
         * @param tile The second GameObject to separate
         * @returns {boolean} Whether the objects in fact touched and were separated along the Y axis.
         */
        /*
        public separateTileY(object: Sprite, x: number, y: number, width: number, height: number, mass: number, collideUp: boolean, collideDown: boolean, separate: boolean): boolean {

            //  Can't separate two immovable objects (tiles are always immovable)
            if (object.immovable)
            {
                return false;
            }

            //  First, get the two object deltas
            var overlap: number = 0;
            var objDelta: number = object.y - object.last.y;

            if (objDelta != 0)
            {
                //  Check if the Y hulls actually overlap
                var objDeltaAbs: number = (objDelta > 0) ? objDelta : -objDelta;
                var objBounds: Rectangle = new Rectangle(object.x, object.y - ((objDelta > 0) ? objDelta : 0), object.width, object.height + objDeltaAbs);

                if ((objBounds.x + objBounds.width > x) && (objBounds.x < x + width) && (objBounds.y + objBounds.height > y) && (objBounds.y < y + height))
                {
                    var maxOverlap: number = objDeltaAbs + Collision.OVERLAP_BIAS;

                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if (objDelta > 0)
                    {
                        overlap = object.y + object.height - y;

                        if ((overlap > maxOverlap) || !(object.allowCollisions & Collision.DOWN) || collideUp == false)
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object.touching |= Collision.DOWN;
                        }
                    }
                    else if (objDelta < 0)
                    {
                        overlap = object.y - height - y;

                        if ((-overlap > maxOverlap) || !(object.allowCollisions & Collision.UP) || collideDown == false)
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object.touching |= Collision.UP;
                        }
                    }
                }
            }

            // TODO - with super low velocities you get lots of stuttering, set some kind of base minimum here

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (overlap != 0)
            {
                if (separate == true)
                {
                    object.y = object.y - overlap;
                    object.velocity.y = -(object.velocity.y * object.elasticity);
                }

                Collision.TILE_OVERLAP = true;
                return true;
            }
            else
            {
                return false;
            }
        }
        */


        /**
         * Separates the two objects on their x axis
         * @param object The GameObject to separate
         * @param tile The Tile to separate
         * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
         */
        /*
        public static NEWseparateTileX(object:Sprite, x: number, y: number, width: number, height: number, mass: number, collideLeft: boolean, collideRight: boolean, separate: boolean): boolean {

            //  Can't separate two immovable objects (tiles are always immovable)
            if (object.immovable)
            {
                return false;
            }

            //  First, get the object delta
            var overlap: number = 0;

            if (object.collisionMask.deltaX != 0)
            {
                //  Check if the X hulls actually overlap
                //var objDeltaAbs: number = (objDelta > 0) ? objDelta : -objDelta;
                //var objBounds: Rectangle = new Rectangle(object.x - ((objDelta > 0) ? objDelta : 0), object.last.y, object.width + ((objDelta > 0) ? objDelta : -objDelta), object.height);

                //if ((objBounds.x + objBounds.width > x) && (objBounds.x < x + width) && (objBounds.y + objBounds.height > y) && (objBounds.y < y + height))
                if (object.collisionMask.intersectsRaw(x, x + width, y, y + height))
                {
                    var maxOverlap: number = object.collisionMask.deltaXAbs + Collision.OVERLAP_BIAS;

                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if (object.collisionMask.deltaX > 0)
                    {
                        //overlap = object.x + object.width - x;
                        overlap = object.collisionMask.right - x;

                        if ((overlap > maxOverlap) || !(object.allowCollisions & Collision.RIGHT) || collideLeft == false)
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object.touching |= Collision.RIGHT;
                        }
                    }
                    else if (object.collisionMask.deltaX < 0)
                    {
                        //overlap = object.x - width - x;
                        overlap = object.collisionMask.x - width - x;

                        if ((-overlap > maxOverlap) || !(object.allowCollisions & Collision.LEFT) || collideRight == false)
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object.touching |= Collision.LEFT;
                        }

                    }

                }
            }

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (overlap != 0)
            {
                if (separate == true)
                {
                    object.x = object.x - overlap;
                    object.velocity.x = -(object.velocity.x * object.elasticity);
                }

                Collision.TILE_OVERLAP = true;
                return true;
            }
            else
            {
                return false;
            }

        }
        */

        /**
         * Separates the two objects on their y axis
         * @param object The first GameObject to separate
         * @param tile The second GameObject to separate
         * @returns {boolean} Whether the objects in fact touched and were separated along the Y axis.
         */
        /*
        public NEWseparateTileY(object: Sprite, x: number, y: number, width: number, height: number, mass: number, collideUp: boolean, collideDown: boolean, separate: boolean): boolean {

            //  Can't separate two immovable objects (tiles are always immovable)
            if (object.immovable)
            {
                return false;
            }

            //  First, get the two object deltas
            var overlap: number = 0;
            //var objDelta: number = object.y - object.last.y;

            if (object.collisionMask.deltaY != 0)
            {
                //  Check if the Y hulls actually overlap
                //var objDeltaAbs: number = (objDelta > 0) ? objDelta : -objDelta;
                //var objBounds: Rectangle = new Rectangle(object.x, object.y - ((objDelta > 0) ? objDelta : 0), object.width, object.height + objDeltaAbs);

                //if ((objBounds.x + objBounds.width > x) && (objBounds.x < x + width) && (objBounds.y + objBounds.height > y) && (objBounds.y < y + height))
                if (object.collisionMask.intersectsRaw(x, x + width, y, y + height))
                {
                    //var maxOverlap: number = objDeltaAbs + Collision.OVERLAP_BIAS;
                    var maxOverlap: number = object.collisionMask.deltaYAbs + Collision.OVERLAP_BIAS;

                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if (object.collisionMask.deltaY > 0)
                    {
                        //overlap = object.y + object.height - y;
                        overlap = object.collisionMask.bottom - y;

                        if ((overlap > maxOverlap) || !(object.allowCollisions & Collision.DOWN) || collideUp == false)
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object.touching |= Collision.DOWN;
                        }
                    }
                    else if (object.collisionMask.deltaY < 0)
                    {
                        //overlap = object.y - height - y;
                        overlap = object.collisionMask.y - height - y;

                        if ((-overlap > maxOverlap) || !(object.allowCollisions & Collision.UP) || collideDown == false)
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object.touching |= Collision.UP;
                        }
                    }
                }
            }

            // TODO - with super low velocities you get lots of stuttering, set some kind of base minimum here

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (overlap != 0)
            {
                if (separate == true)
                {
                    object.y = object.y - overlap;
                    object.velocity.y = -(object.velocity.y * object.elasticity);
                }

                Collision.TILE_OVERLAP = true;
                return true;
            }
            else
            {
                return false;
            }
        }
    */

    }

}