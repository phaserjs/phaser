/// <reference path="../Game.ts" />
/// <reference path="../Basic.ts" />
/// <reference path="../Signal.ts" />
/// <reference path="../system/CollisionMask.ts" />

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
         * Create a new <code>GameObject</code> object at specific position with specific width and height.
         *
         * @param [x] {number} The x position of the object.
         * @param [y] {number} The y position of the object.
         * @param [width] {number} The width of the object.
         * @param [height] {number} The height of the object.
         */
        constructor(game: Game, x?: number = 0, y?: number = 0, width?: number = 16, height?: number = 16) {

            super(game);

            this.canvas = game.stage.canvas;
            this.context = game.stage.context;

            this.frameBounds = new Rectangle(x, y, width, height);
            this.exists = true;
            this.active = true;
            this.visible = true;
            this.alive = true;
            this.isGroup = false;
            this.alpha = 1;
            this.scale = new MicroPoint(1, 1);

            this.last = new MicroPoint(x, y);
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
            this.collisionMask = new CollisionMask(game, this, x, y, width, height);

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
        * A reference to the Canvas this GameObject will render to
        * @type {HTMLCanvasElement}
        */
        public canvas: HTMLCanvasElement;

        /**
        * A reference to the Canvas Context2D this GameObject will render to
        * @type {CanvasRenderingContext2D}
        */
        public context: CanvasRenderingContext2D;

        /**
         * Position of this object after scrolling.
         * @type {MicroPoint}
         */
        public _point: MicroPoint;

        /**
         * An Array of Cameras to which this GameObject won't render
         * @type {Array}
         */
        public cameraBlacklist: number[];

        /**
         * Rectangle container of this object.
         * @type {Rectangle}
         */
        public frameBounds: Rectangle;

        /**
         * This objects CollisionMask
         * @type {CollisionMask}
         */
        public collisionMask: CollisionMask;

        /**
         * A rectangular area which is object is allowed to exist within. If it travels outside of this area it will perform the outOfBoundsAction.
         * @type {Quad}
         */
        public worldBounds: Quad;

        /**
         * What action will be performed when object is out of the worldBounds.
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
         * Orientation of the object.
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
         * Controls if the GameObject is rendered rotated or not.
        * If renderRotation is false then the object can still rotate but it will never be rendered rotated.
         * @type {boolean}
         */
        public renderRotation: bool = true;

        //  Physics properties

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

            this.last.x = this.frameBounds.x;
            this.last.y = this.frameBounds.y;

            this.collisionMask.preUpdate();

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
                
            this.collisionMask.update();

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
            this.frameBounds.x += delta;

            velocityDelta = (this._game.motion.computeVelocity(this.velocity.y, this.acceleration.y, this.drag.y, this.maxVelocity.y) - this.velocity.y) / 2;
            this.velocity.y += velocityDelta;
            delta = this.velocity.y * this._game.time.elapsed;
            this.velocity.y += velocityDelta;
            this.frameBounds.y += delta;

        }

        /**
        * Checks to see if some <code>GameObject</code> overlaps this <code>GameObject</code> or <code>Group</code>.
        * If the group has a LOT of things in it, it might be faster to use <code>Collision.overlaps()</code>.
        * WARNING: Currently tilemaps do NOT support screen space overlap checks!
        *
        * @param objectOrGroup {object} The object or group being tested.
        * @param inScreenSpace {boolean} Whether to take scroll factors numbero account when checking for overlap.  Default is false, or "only compare in world space."
        * @param camera {Camera} Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return {boolean} Whether or not the objects overlap this.
        */
        public overlaps(objectOrGroup, inScreenSpace: bool = false, camera: Camera = null): bool {

            if (objectOrGroup.isGroup)
            {
                var results: bool = false;
                var i: number = 0;
                var members = <Group> objectOrGroup.members;

                while (i < length)
                {
                    if (this.overlaps(members[i++], inScreenSpace, camera))
                    {
                        results = true;
                    }
                }

                return results;

            }

            if (!inScreenSpace)
            {
                return (objectOrGroup.x + objectOrGroup.width > this.x) && (objectOrGroup.x < this.x + this.width) &&
                        (objectOrGroup.y + objectOrGroup.height > this.y) && (objectOrGroup.y < this.y + this.height);
            }

            if (camera == null)
            {
                camera = this._game.camera;
            }

            var objectScreenPos: Point = objectOrGroup.getScreenXY(null, camera);

            this.getScreenXY(this._point, camera);

            return (objectScreenPos.x + objectOrGroup.width > this._point.x) && (objectScreenPos.x < this._point.x + this.width) &&
                    (objectScreenPos.y + objectOrGroup.height > this._point.y) && (objectScreenPos.y < this._point.y + this.height);
        }

        /**
        * Checks to see if this <code>GameObject</code> were located at the given position, would it overlap the <code>GameObject</code> or <code>Group</code>?
        * This is distinct from overlapsPoint(), which just checks that point, rather than taking the object's size numbero account.
        * WARNING: Currently tilemaps do NOT support screen space overlap checks!
        *
        * @param X {number} The X position you want to check.  Pretends this object (the caller, not the parameter) is located here.
        * @param Y {number} The Y position you want to check.  Pretends this object (the caller, not the parameter) is located here.
        * @param objectOrGroup {object} The object or group being tested.
        * @param inScreenSpace {boolean} Whether to take scroll factors numbero account when checking for overlap.  Default is false, or "only compare in world space."
        * @param camera {Camera} Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return {boolean} Whether or not the two objects overlap.
        */
        public overlapsAt(X: number, Y: number, objectOrGroup, inScreenSpace: bool = false, camera: Camera = null): bool {

            if (objectOrGroup.isGroup)
            {
                var results: bool = false;
                var basic;
                var i: number = 0;
                var members = objectOrGroup.members;

                while (i < length)
                {
                    if (this.overlapsAt(X, Y, members[i++], inScreenSpace, camera))
                    {
                        results = true;
                    }
                }

                return results;
            }

            if (!inScreenSpace)
            {
                return (objectOrGroup.x + objectOrGroup.width > X) && (objectOrGroup.x < X + this.width) &&
                        (objectOrGroup.y + objectOrGroup.height > Y) && (objectOrGroup.y < Y + this.height);
            }

            if (camera == null)
            {
                camera = this._game.camera;
            }

            var objectScreenPos: Point = objectOrGroup.getScreenXY(null, Camera);

            this._point.x = X - camera.scroll.x * this.scrollFactor.x; //copied from getScreenXY()
            this._point.y = Y - camera.scroll.y * this.scrollFactor.y;
            this._point.x += (this._point.x > 0) ? 0.0000001 : -0.0000001;
            this._point.y += (this._point.y > 0) ? 0.0000001 : -0.0000001;

            return (objectScreenPos.x + objectOrGroup.width > this._point.x) && (objectScreenPos.x < this._point.x + this.width) &&
                (objectScreenPos.y + objectOrGroup.height > this._point.y) && (objectScreenPos.y < this._point.y + this.height);
        }

        /**
        * Checks to see if a point in 2D world space overlaps this <code>GameObject</code>.
        *
        * @param point {Point} The point in world space you want to check.
        * @param inScreenSpace {boolean} Whether to take scroll factors into account when checking for overlap.
        * @param camera {Camera} Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return   Whether or not the point overlaps this object.
        */
        public overlapsPoint(point: Point, inScreenSpace: bool = false, camera: Camera = null): bool {

            if (!inScreenSpace)
            {
                return (point.x > this.x) && (point.x < this.x + this.width) && (point.y > this.y) && (point.y < this.y + this.height);
            }

            if (camera == null)
            {
                camera = this._game.camera;
            }

            var X: number = point.x - camera.scroll.x;
            var Y: number = point.y - camera.scroll.y;

            this.getScreenXY(this._point, camera);

            return (X > this._point.x) && (X < this._point.x + this.width) && (Y > this._point.y) && (Y < this._point.y + this.height);

        }

        /**
        * Check and see if this object is currently on screen.
        *
        * @param camera {Camera} Specify which game camera you want. If null getScreenXY() will just grab the first global camera.
        *
        * @return {boolean} Whether the object is on screen or not.
        */
        public onScreen(camera: Camera = null): bool {

            if (camera == null)
            {
                camera = this._game.camera;
            }

            this.getScreenXY(this._point, camera);

            return (this._point.x + this.width > 0) && (this._point.x < camera.width) && (this._point.y + this.height > 0) && (this._point.y < camera.height);

        }

        /**
        * Call this to figure out the on-screen position of the object.
        *
        * @param point {Point} Takes a <code>MicroPoint</code> object and assigns the post-scrolled X and Y values of this object to it.
        * @param camera {Camera} Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return {MicroPoint} The <code>MicroPoint</code> you passed in, or a new <code>Point</code> if you didn't pass one, containing the screen X and Y position of this object.
        */
        public getScreenXY(point: MicroPoint = null, camera: Camera = null): MicroPoint {

            if (point == null)
            {
                point = new MicroPoint();
            }

            if (camera == null)
            {
                camera = this._game.camera;
            }

            point.x = this.x - camera.scroll.x * this.scrollFactor.x;
            point.y = this.y - camera.scroll.y * this.scrollFactor.y;
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

        public set solid(value: bool) {

            if (value)
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
        * @param point {Point} Allows you to pass in an existing <code>Point</code> object if you're so inclined.  Otherwise a new one is created.
        *
        * @return {MicroPoint} A <code>Point</code> object containing the midpoint of this object in world coordinates.
        */
        public getMidpoint(point: MicroPoint = null): MicroPoint {

            if (point == null)
            {
                point = new MicroPoint();
            }

            point.copyFrom(this.frameBounds.center);

            return point;

        }

        /**
        * Handy for reviving game objects.
        * Resets their existence flags and position.
        *
        * @param x {number} The new X position of this object.
        * @param y {number} The new Y position of this object.
        */
        public reset(x: number, y: number) {

            this.revive();
            this.touching = Collision.NONE;
            this.wasTouching = Collision.NONE;
            this.x = x;
            this.y = y;
            this.last.x = x;
            this.last.y = y;
            this.velocity.x = 0;
            this.velocity.y = 0;

        }

        /**
        * Handy for checking if this object is touching a particular surface.
        * For slightly better performance you can just &amp; the value directly into <code>touching</code>.
        * However, this method is good for readability and accessibility.
        *
        * @param Direction {number} Any of the collision flags (e.g. LEFT, FLOOR, etc).
        *
        * @return {boolean} Whether the object is touching an object in (any of) the specified direction(s) this frame.
        */
        public isTouching(direction: number): bool {
            return (this.touching & direction) > Collision.NONE;
        }

        /**
        * Handy function for checking if this object just landed on a particular surface.
        *
        * @param Direction {number} Any of the collision flags (e.g. LEFT, FLOOR, etc).
        *
        * @returns {boolean} Whether the object just landed on any specicied surfaces.
        */
        public justTouched(direction: number): bool {
            return ((this.touching & direction) > Collision.NONE) && ((this.wasTouching & direction) <= Collision.NONE);
        }

        /**
        * Reduces the "health" variable of this sprite by the amount specified in Damage.
        * Calls kill() if health drops to or below zero.
        *
        * @param Damage {number} How much health to take away (use a negative number to give a health bonus).
        */
        public hurt(damage: number) {

            this.health = this.health - damage;

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
        * @param x {number} x position of the bound
        * @param y {number} y position of the bound
        * @param width {number} width of its bound
        * @param height {number} height of its bound
        */
        public setBounds(x: number, y: number, width: number, height: number) {

            this.worldBounds = new Quad(x, y, width, height);

        }

        /**
        * Set the world bounds that this GameObject can exist within based on the size of the current game world.
        *
        * @param action {number} The action to take if the object hits the world bounds, either OUT_OF_BOUNDS_KILL or OUT_OF_BOUNDS_STOP
        */
        public setBoundsFromWorld(action?: number = GameObject.OUT_OF_BOUNDS_STOP) {

            this.setBounds(this._game.world.bounds.x, this._game.world.bounds.y, this._game.world.bounds.width, this._game.world.bounds.height);
            this.outOfBoundsAction = action;

        }

        /**
        * If you do not wish this object to be visible to a specific camera, pass the camera here.
        *
        * @param camera {Camera} The specific camera.
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
        * @param camera {Camera} The camera you wish it to be visible.
        */
        public showToCamera(camera: Camera) {

            if (this.cameraBlacklist.indexOf(camera.ID) !== -1)
            {
                this.cameraBlacklist.slice(this.cameraBlacklist.indexOf(camera.ID), 1);
            }

        }

        /**
         * This clears the camera black list, making the GameObject visible to all cameras.
         */
        public clearCameraList() {

            this.cameraBlacklist.length = 0;

        }

        /**
         * Clean up memory.
         */
        public destroy() {
        }

        public setPosition(x: number, y: number) {

            this.x = x;
            this.y = y;

        }

        public get x(): number {
            return this.frameBounds.x;
        }

        public set x(value: number) {
            this.frameBounds.x = value;
        }

        public get y(): number {
            return this.frameBounds.y;
        }

        public set y(value: number) {
            this.frameBounds.y = value;
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
            this.frameBounds.width = value;
        }

        public set height(value:number) {
            this.frameBounds.height = value;
        }

        public get width(): number {
            return this.frameBounds.width;
        }

        public get height(): number {
            return this.frameBounds.height;
        }

    }

}