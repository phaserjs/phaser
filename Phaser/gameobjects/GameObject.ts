/// <reference path="../Game.ts" />
/// <reference path="../Basic.ts" />
/// <reference path="../Signal.ts" />

/**
* Phaser - GameObject
*
* This is the base GameObject on which all other game objects are derived. It contains all the logic required for position,
* motion, size, collision and input.
*/

module Phaser {

    export class GameObject extends Basic {

        /**
         * GameObject constructor
         *
         * Create a new <code>GameObject</code> object at specific position with
         * specific width and height.
         *
         * @param x      Optinal, the x position of the object.
         * @param y      Optinal, the y position of the object.
         * @param width  Optinal, the width of the object.
         * @param height Optinal, the height of the object.
         */
        constructor(game: Game, x?: number = 0, y?: number = 0, width?: number = 16, height?: number = 16) {

            super(game);

            this.bounds = new Rectangle(x, y, width, height);
            this.exists = true;
            this.active = true;
            this.visible = true;
            this.alive = true;
            this.isGroup = false;
            this.alpha = 1;
            this.scale = new MicroPoint(1, 1);

            this.last = new MicroPoint(x, y);
            this.origin = new MicroPoint(this.bounds.halfWidth, this.bounds.halfHeight);
            this.align = GameObject.ALIGN_TOP_LEFT;
            this.mass = 1;
            this.elasticity = 0;
            this.health = 1;
            this.immovable = false;
            this.moves = true;
            this.worldBounds = null;

            this.touching = Collision.NONE;
            this.wasTouching = Collision.NONE;
            this.allowCollisions = Collision.ANY;

            this.velocity = new MicroPoint();
            this.acceleration = new MicroPoint();
            this.drag = new MicroPoint();
            this.maxVelocity = new MicroPoint(10000, 10000);

            this.angle = 0;
            this.angularVelocity = 0;
            this.angularAcceleration = 0;
            this.angularDrag = 0;
            this.maxAngular = 10000;

            this.cameraBlacklist = [];
            this.scrollFactor = new MicroPoint(1, 1);

        }

        /**
         * Angle of this object.
         * @type {number}
         */
        private _angle: number = 0;

        /**
         * Pivot position enum: at the top-left corner.
         * @type {number}
         */
        public static ALIGN_TOP_LEFT: number = 0;
        /**
         * Pivot position enum: at the top-center corner.
         * @type {number}
         */
        public static ALIGN_TOP_CENTER: number = 1;
        /**
         * Pivot position enum: at the top-right corner.
         * @type {number}
         */
        public static ALIGN_TOP_RIGHT: number = 2;
        /**
         * Pivot position enum: at the center-left corner.
         * @type {number}
         */
        public static ALIGN_CENTER_LEFT: number = 3;
        /**
         * Pivot position enum: at the center corner.
         * @type {number}
         */
        public static ALIGN_CENTER: number = 4;
        /**
         * Pivot position enum: at the center-right corner.
         * @type {number}
         */
        public static ALIGN_CENTER_RIGHT: number = 5;
        /**
         * Pivot position enum: at the bottom-left corner.
         * @type {number}
         */
        public static ALIGN_BOTTOM_LEFT: number = 6;
        /**
         * Pivot position enum: at the bottom-center corner.
         * @type {number}
         */
        public static ALIGN_BOTTOM_CENTER: number = 7;
        /**
         * Pivot position enum: at the bottom-right corner.
         * @type {number}
         */
        public static ALIGN_BOTTOM_RIGHT: number = 8;

        /**
         * Enum value for outOfBoundsAction. Stop the object when is out of world bounds.
         * @type {number}
         */
        public static OUT_OF_BOUNDS_STOP: number = 0;
        /**
         * Enum value for outOfBoundsAction. Kill the object when is out of world bounds.
         * @type {number}
         */
        public static OUT_OF_BOUNDS_KILL: number = 1;

        /**
         * Position of this object after scrolling.
         * @type {MicroPoint}
         */
        public _point: MicroPoint;

        public cameraBlacklist: number[];
        /**
         * Rectangle container of this object.
         * @type {Rectangle}
         */
        public bounds: Rectangle;
        /**
         * Bound of world.
         * @type {Quad}
         */
        public worldBounds: Quad;
        /**
         * What action will be performed when object is out of bounds.
         * This will default to GameObject.OUT_OF_BOUNDS_STOP.
         * @type {number}
         */
        public outOfBoundsAction: number = 0;
        /**
         * At which point the graphic of this object will align to.
         * Align of the object will default to GameObject.ALIGN_TOP_LEFT.
         * @type {number}
         */
        public align: number;
        /**
         * Oorientation of the object.
         * @type {number}
         */
        public facing: number;
        /**
         * Set alpha to a number between 0 and 1 to change the opacity.
         * @type {number}
         */
        public alpha: number;
        /**
         * Scale factor of the object.
         * @type {MicroPoint}
         */
        public scale: MicroPoint;
        /**
         * Origin is the anchor point that the object will rotate by.
         * The origin will default to its center.
         * @type {MicroPoint}
         */
        public origin: MicroPoint;
        /**
         * Z-order value of the object.
         */
        public z: number = 0;

        /**
         * This value is added to the angle of the GameObject.
         * For example if you had a sprite drawn facing straight up then you could set
         * rotationOffset to 90 and it would correspond correctly with Phasers rotation system
         * @type {number}
         */
        public rotationOffset: number = 0;

        /**
         * Render graphic based on its angle?
         * @type {boolean}
         */
        public renderRotation: bool = true;

        //  Physics properties

        /**
         * Whether this object will be moved or not.
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
         * A point that can store numbers from 0 to 1 (for X and Y independently)
         * which governs how much this object is affected by the camera .
         * @type {MicroPoint}
         */
        public scrollFactor: MicroPoint;

        /**
         * Handy for storing health percentage or armor points or whatever.
         * @type {number}
         */
        public health: number;
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

        //  Input
        public inputEnabled: bool = false;
        private _inputOver: bool = false;

        public onInputOver: Phaser.Signal;
        public onInputOut: Phaser.Signal;
        public onInputDown: Phaser.Signal;
        public onInputUp: Phaser.Signal;

        /**
         * Pre-update is called right before update() on each object in the game loop.
         */
        public preUpdate() {

            //  flicker time

            this.last.x = this.bounds.x;
            this.last.y = this.bounds.y;

        }

        /**
         * Override this function to update your class's position and appearance.
         */
        public update() {
        }

        /**
         * Automatically called after update() by the game loop.
         */
        public postUpdate() {

            if (this.moves)
            {
                this.updateMotion();
            }

            if (this.worldBounds != null)
            {
                if (this.outOfBoundsAction == GameObject.OUT_OF_BOUNDS_KILL)
                {
                    if (this.x < this.worldBounds.x || this.x > this.worldBounds.right || this.y < this.worldBounds.y || this.y > this.worldBounds.bottom)
                    {
                        this.kill();
                    }
                }
                else
                {
                    if (this.x < this.worldBounds.x)
                    {
                        this.x = this.worldBounds.x;
                    }
                    else if (this.x > this.worldBounds.right)
                    {
                        this.x = this.worldBounds.right;
                    }

                    if (this.y < this.worldBounds.y)
                    {
                        this.y = this.worldBounds.y;
                    }
                    else if (this.y > this.worldBounds.bottom)
                    {
                        this.y = this.worldBounds.bottom;
                    }
                }
            }

            if (this.inputEnabled)
            {
                this.updateInput();
            }

            this.wasTouching = this.touching;
            this.touching = Collision.NONE;

        }

        /**
         * Update input.
         */
        private updateInput() {
        }

        /**
         * Internal function for updating the position and speed of this object.
         */
        private updateMotion() {

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
            this.bounds.x += delta;

            velocityDelta = (this._game.motion.computeVelocity(this.velocity.y, this.acceleration.y, this.drag.y, this.maxVelocity.y) - this.velocity.y) / 2;
            this.velocity.y += velocityDelta;
            delta = this.velocity.y * this._game.time.elapsed;
            this.velocity.y += velocityDelta;
            this.bounds.y += delta;

        }

        /**
        * Checks to see if some <code>GameObject</code> overlaps this <code>GameObject</code> or <code>Group</code>.
        * If the group has a LOT of things in it, it might be faster to use <code>Collision.overlaps()</code>.
        * WARNING: Currently tilemaps do NOT support screen space overlap checks!
        *
        * @param    ObjectOrGroup   The object or group being tested.
        * @param    InScreenSpace   Whether to take scroll factors numbero account when checking for overlap.  Default is false, or "only compare in world space."
        * @param    Camera          Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return   Whether or not the two objects overlap.
        */
        public overlaps(ObjectOrGroup, InScreenSpace: bool = false, Camera: Camera = null): bool {

            if (ObjectOrGroup.isGroup)
            {
                var results: bool = false;
                var i: number = 0;
                var members = <Group> ObjectOrGroup.members;

                while (i < length)
                {
                    if (this.overlaps(members[i++], InScreenSpace, Camera))
                    {
                        results = true;
                    }
                }

                return results;

            }

            if (!InScreenSpace)
            {
                return (ObjectOrGroup.x + ObjectOrGroup.width > this.x) && (ObjectOrGroup.x < this.x + this.width) &&
                        (ObjectOrGroup.y + ObjectOrGroup.height > this.y) && (ObjectOrGroup.y < this.y + this.height);
            }

            if (Camera == null)
            {
                Camera = this._game.camera;
            }

            var objectScreenPos: Point = ObjectOrGroup.getScreenXY(null, Camera);

            this.getScreenXY(this._point, Camera);

            return (objectScreenPos.x + ObjectOrGroup.width > this._point.x) && (objectScreenPos.x < this._point.x + this.width) &&
                    (objectScreenPos.y + ObjectOrGroup.height > this._point.y) && (objectScreenPos.y < this._point.y + this.height);
        }

        /**
        * Checks to see if this <code>GameObject</code> were located at the given position, would it overlap the <code>GameObject</code> or <code>Group</code>?
        * This is distinct from overlapsPoint(), which just checks that point, rather than taking the object's size numbero account.
        * WARNING: Currently tilemaps do NOT support screen space overlap checks!
        *
        * @param    X               The X position you want to check.  Pretends this object (the caller, not the parameter) is located here.
        * @param    Y               The Y position you want to check.  Pretends this object (the caller, not the parameter) is located here.
        * @param    ObjectOrGroup   The object or group being tested.
        * @param    InScreenSpace   Whether to take scroll factors numbero account when checking for overlap.  Default is false, or "only compare in world space."
        * @param    Camera          Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return   Whether or not the two objects overlap.
        */
        public overlapsAt(X: number, Y: number, ObjectOrGroup, InScreenSpace: bool = false, Camera: Camera = null): bool {

            if (ObjectOrGroup.isGroup)
            {
                var results: bool = false;
                var basic;
                var i: number = 0;
                var members = ObjectOrGroup.members;

                while (i < length)
                {
                    if (this.overlapsAt(X, Y, members[i++], InScreenSpace, Camera))
                    {
                        results = true;
                    }
                }

                return results;
            }

            if (!InScreenSpace)
            {
                return (ObjectOrGroup.x + ObjectOrGroup.width > X) && (ObjectOrGroup.x < X + this.width) &&
                        (ObjectOrGroup.y + ObjectOrGroup.height > Y) && (ObjectOrGroup.y < Y + this.height);
            }

            if (Camera == null)
            {
                Camera = this._game.camera;
            }

            var objectScreenPos: Point = ObjectOrGroup.getScreenXY(null, Camera);

            this._point.x = X - Camera.scroll.x * this.scrollFactor.x; //copied from getScreenXY()
            this._point.y = Y - Camera.scroll.y * this.scrollFactor.y;
            this._point.x += (this._point.x > 0) ? 0.0000001 : -0.0000001;
            this._point.y += (this._point.y > 0) ? 0.0000001 : -0.0000001;

            return (objectScreenPos.x + ObjectOrGroup.width > this._point.x) && (objectScreenPos.x < this._point.x + this.width) &&
                (objectScreenPos.y + ObjectOrGroup.height > this._point.y) && (objectScreenPos.y < this._point.y + this.height);
        }

        /**
        * Checks to see if a point in 2D world space overlaps this <code>GameObject</code>.
        *
        * @param    Point           The point in world space you want to check.
        * @param    InScreenSpace   Whether to take scroll factors into account when checking for overlap.
        * @param    Camera          Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return   Whether or not the point overlaps this object.
        */
        public overlapsPoint(point: Point, InScreenSpace: bool = false, Camera: Camera = null): bool {

            if (!InScreenSpace)
            {
                return (point.x > this.x) && (point.x < this.x + this.width) && (point.y > this.y) && (point.y < this.y + this.height);
            }

            if (Camera == null)
            {
                Camera = this._game.camera;
            }

            var X: number = point.x - Camera.scroll.x;
            var Y: number = point.y - Camera.scroll.y;

            this.getScreenXY(this._point, Camera);

            return (X > this._point.x) && (X < this._point.x + this.width) && (Y > this._point.y) && (Y < this._point.y + this.height);

        }

        /**
        * Check and see if this object is currently on screen.
        *
        * @param    Camera      Specify which game camera you want. If null getScreenXY() will just grab the first global camera.
        *
        * @return   Whether the object is on screen or not.
        */
        public onScreen(Camera: Camera = null): bool {

            if (Camera == null)
            {
                Camera = this._game.camera;
            }

            this.getScreenXY(this._point, Camera);

            return (this._point.x + this.width > 0) && (this._point.x < Camera.width) && (this._point.y + this.height > 0) && (this._point.y < Camera.height);

        }

        /**
        * Call this to figure out the on-screen position of the object.
        *
        * @param    Camera      Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        * @param    Point       Takes a <code>MicroPoint</code> object and assigns the post-scrolled X and Y values of this object to it.
        *
        * @return   The <code>MicroPoint</code> you passed in, or a new <code>Point</code> if you didn't pass one, containing the screen X and Y position of this object.
        */
        public getScreenXY(point: MicroPoint = null, Camera: Camera = null): MicroPoint {

            if (point == null)
            {
                point = new MicroPoint();
            }

            if (Camera == null)
            {
                Camera = this._game.camera;
            }

            point.x = this.x - Camera.scroll.x * this.scrollFactor.x;
            point.y = this.y - Camera.scroll.y * this.scrollFactor.y;
            point.x += (point.x > 0) ? 0.0000001 : -0.0000001;
            point.y += (point.y > 0) ? 0.0000001 : -0.0000001;

            return point;

        }

        /**
        * Whether the object collides or not.  For more control over what directions
        * the object will collide from, use collision constants (like LEFT, FLOOR, etc)
        * to set the value of allowCollisions directly.
        */
        public get solid(): bool {
            return (this.allowCollisions & Collision.ANY) > Collision.NONE;
        }

        public set solid(Solid: bool) {

            if (Solid)
            {
                this.allowCollisions = Collision.ANY;
            }
            else
            {
                this.allowCollisions = Collision.NONE;
            }

        }

        /**
        * Retrieve the midpoint of this object in world coordinates.
        *
        * @Point    Allows you to pass in an existing <code>Point</code> object if you're so inclined.  Otherwise a new one is created.
        *
        * @return   A <code>Point</code> object containing the midpoint of this object in world coordinates.
        */
        public getMidpoint(point: MicroPoint = null): MicroPoint {

            if (point == null)
            {
                point = new MicroPoint();
            }

            point.copyFrom(this.bounds.center);

            return point;

        }

        /**
        * Handy for reviving game objects.
        * Resets their existence flags and position.
        *
        * @param    X   The new X position of this object.
        * @param    Y   The new Y position of this object.
        */
        public reset(X: number, Y: number) {

            this.revive();
            this.touching = Collision.NONE;
            this.wasTouching = Collision.NONE;
            this.x = X;
            this.y = Y;
            this.last.x = X;
            this.last.y = Y;
            this.velocity.x = 0;
            this.velocity.y = 0;

        }

        /**
        * Handy for checking if this object is touching a particular surface.
        * For slightly better performance you can just &amp; the value directly numbero <code>touching</code>.
        * However, this method is good for readability and accessibility.
        *
        * @param    Direction   Any of the collision flags (e.g. LEFT, FLOOR, etc).
        *
        * @return   Whether the object is touching an object in (any of) the specified direction(s) this frame.
        */
        public isTouching(Direction: number): bool {
            return (this.touching & Direction) > Collision.NONE;
        }

        /**
        * Handy for checking if this object is just landed on a particular surface.
        *
        * @param    Direction   Any of the collision flags (e.g. LEFT, FLOOR, etc).
        *
        * @return   Whether the object just landed on (any of) the specified surface(s) this frame.
        */

        /**
        * Handy function for checking if this object is just landed on a particular surface.
        *
        * @param    Direction   Any of the collision flags (e.g. LEFT, FLOOR, etc).
        *
        * @returns  bool        Whether the object just landed on any specicied surfaces.
        */
        public justTouched(Direction: number): bool {
            return ((this.touching & Direction) > Collision.NONE) && ((this.wasTouching & Direction) <= Collision.NONE);
        }

        /**
        * Reduces the "health" variable of this sprite by the amount specified in Damage.
        * Calls kill() if health drops to or below zero.
        *
        * @param    Damage      How much health to take away (use a negative number to give a health bonus).
        */
        public hurt(Damage: number) {

            this.health = this.health - Damage;

            if (this.health <= 0)
            {
                this.kill();
            }

        }

        /**
        * Set the world bounds that this GameObject can exist within. By default a GameObject can exist anywhere
        * in the world. But by setting the bounds (which are given in world dimensions, not screen dimensions)
        * it can be stopped from leaving the world, or a section of it.
        *
        * @param    x       x position of the bound
        * @param    y       y position of the bound
        * @param    width   width of its bound
        * @param    height  height of its bound
        */
        public setBounds(x: number, y: number, width: number, height: number) {

            this.worldBounds = new Quad(x, y, width, height);

        }

        /**
        * If you do not wish this object to be visible to a specific camera, pass the camera here.

        * @param    camera  The specific camera.
        */
        public hideFromCamera(camera: Camera) {

            if (this.cameraBlacklist.indexOf(camera.ID) == -1)
            {
                this.cameraBlacklist.push(camera.ID);
            }

        }


        /**
        * Make this object only visible to a specific camera.
        *
        * @param    camera  The camera you wish it to be visible.
        */
        public showToCamera(camera: Camera) {

            if (this.cameraBlacklist.indexOf(camera.ID) !== -1)
            {
                this.cameraBlacklist.slice(this.cameraBlacklist.indexOf(camera.ID), 1);
            }

        }

        /**
         * This will make the object not visible to any cameras.
         */
        public clearCameraList() {

            this.cameraBlacklist.length = 0;

        }

        /**
         * Clean up memory.
         */
        public destroy() {

        }

        public get x(): number {
            return this.bounds.x;
        }

        public set x(value: number) {
            this.bounds.x = value;
        }

        public get y(): number {
            return this.bounds.y;
        }

        public set y(value: number) {
            this.bounds.y = value;
        }

        public get rotation(): number {
            return this._angle;
        }

        public set rotation(value: number) {
            this._angle = this._game.math.wrap(value, 360, 0);
        }

        public get angle(): number {
            return this._angle;
        }

        public set angle(value: number) {
            this._angle = this._game.math.wrap(value, 360, 0);
        }

        public set width(value:number) {
            this.bounds.width = value;
        }

        public set height(value:number) {
            this.bounds.height = value;
        }

        public get width(): number {
            return this.bounds.width;
        }

        public get height(): number {
            return this.bounds.height;
        }

    }

}