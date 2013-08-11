var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
var Phaser;
(function (Phaser) {
    var GameObject = (function (_super) {
        __extends(GameObject, _super);
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
        function GameObject(game, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 16; }
            if (typeof height === "undefined") { height = 16; }
            _super.call(this, game);
            /**
            * Angle of this object.
            * @type {number}
            */
            this._angle = 0;
            /**
            * What action will be performed when object is out of the worldBounds.
            * This will default to GameObject.OUT_OF_BOUNDS_STOP.
            * @type {number}
            */
            this.outOfBoundsAction = 0;
            /**
            * Z-order value of the object.
            */
            this.z = 0;
            /**
            * This value is added to the angle of the GameObject.
            * For example if you had a sprite drawn facing straight up then you could set
            * rotationOffset to 90 and it would correspond correctly with Phasers rotation system
            * @type {number}
            */
            this.rotationOffset = 0;
            /**
            * Controls if the GameObject is rendered rotated or not.
            * If renderRotation is false then the object can still rotate but it will never be rendered rotated.
            * @type {boolean}
            */
            this.renderRotation = true;
            /**
            * Set this to false if you want to skip the automatic motion/movement stuff
            * (see updateMotion()).
            * @type {boolean}
            */
            this.moves = true;
            //  Input
            this.inputEnabled = false;
            this._inputOver = false;
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
        GameObject.ALIGN_TOP_LEFT = 0;
        GameObject.ALIGN_TOP_CENTER = 1;
        GameObject.ALIGN_TOP_RIGHT = 2;
        GameObject.ALIGN_CENTER_LEFT = 3;
        GameObject.ALIGN_CENTER = 4;
        GameObject.ALIGN_CENTER_RIGHT = 5;
        GameObject.ALIGN_BOTTOM_LEFT = 6;
        GameObject.ALIGN_BOTTOM_CENTER = 7;
        GameObject.ALIGN_BOTTOM_RIGHT = 8;
        GameObject.OUT_OF_BOUNDS_STOP = 0;
        GameObject.OUT_OF_BOUNDS_KILL = 1;
        GameObject.prototype.preUpdate = /**
        * Pre-update is called right before update() on each object in the game loop.
        */
        function () {
            this.last.x = this.frameBounds.x;
            this.last.y = this.frameBounds.y;
            this.collisionMask.preUpdate();
        };
        GameObject.prototype.update = /**
        * Override this function to update your class's position and appearance.
        */
        function () {
        };
        GameObject.prototype.postUpdate = /**
        * Automatically called after update() by the game loop.
        */
        function () {
            if(this.moves) {
                this.updateMotion();
            }
            if(this.worldBounds != null) {
                if(this.outOfBoundsAction == Phaser.GameObject.OUT_OF_BOUNDS_KILL) {
                    if(this.x < this.worldBounds.x || this.x > this.worldBounds.right || this.y < this.worldBounds.y || this.y > this.worldBounds.bottom) {
                        this.kill();
                    }
                } else {
                    if(this.x < this.worldBounds.x) {
                        this.x = this.worldBounds.x;
                    } else if(this.x > this.worldBounds.right) {
                        this.x = this.worldBounds.right;
                    }
                    if(this.y < this.worldBounds.y) {
                        this.y = this.worldBounds.y;
                    } else if(this.y > this.worldBounds.bottom) {
                        this.y = this.worldBounds.bottom;
                    }
                }
            }
            this.collisionMask.update();
            if(this.inputEnabled) {
                this.updateInput();
            }
            this.wasTouching = this.touching;
            this.touching = Phaser.Collision.NONE;
        };
        GameObject.prototype.updateInput = /**
        * Update input.
        */
        function () {
        };
        GameObject.prototype.updateMotion = /**
        * Internal function for updating the position and speed of this object.
        */
        function () {
            var delta;
            var velocityDelta;
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
        };
        GameObject.prototype.overlaps = /**
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
        function (objectOrGroup, inScreenSpace, camera) {
            if (typeof inScreenSpace === "undefined") { inScreenSpace = false; }
            if (typeof camera === "undefined") { camera = null; }
            if(objectOrGroup.isGroup) {
                var results = false;
                var i = 0;
                var members = objectOrGroup.members;
                while(i < length) {
                    if(this.overlaps(members[i++], inScreenSpace, camera)) {
                        results = true;
                    }
                }
                return results;
            }
            if(!inScreenSpace) {
                return (objectOrGroup.x + objectOrGroup.width > this.x) && (objectOrGroup.x < this.x + this.width) && (objectOrGroup.y + objectOrGroup.height > this.y) && (objectOrGroup.y < this.y + this.height);
            }
            if(camera == null) {
                camera = this._game.camera;
            }
            var objectScreenPos = objectOrGroup.getScreenXY(null, camera);
            this.getScreenXY(this._point, camera);
            return (objectScreenPos.x + objectOrGroup.width > this._point.x) && (objectScreenPos.x < this._point.x + this.width) && (objectScreenPos.y + objectOrGroup.height > this._point.y) && (objectScreenPos.y < this._point.y + this.height);
        };
        GameObject.prototype.overlapsAt = /**
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
        function (X, Y, objectOrGroup, inScreenSpace, camera) {
            if (typeof inScreenSpace === "undefined") { inScreenSpace = false; }
            if (typeof camera === "undefined") { camera = null; }
            if(objectOrGroup.isGroup) {
                var results = false;
                var basic;
                var i = 0;
                var members = objectOrGroup.members;
                while(i < length) {
                    if(this.overlapsAt(X, Y, members[i++], inScreenSpace, camera)) {
                        results = true;
                    }
                }
                return results;
            }
            if(!inScreenSpace) {
                return (objectOrGroup.x + objectOrGroup.width > X) && (objectOrGroup.x < X + this.width) && (objectOrGroup.y + objectOrGroup.height > Y) && (objectOrGroup.y < Y + this.height);
            }
            if(camera == null) {
                camera = this._game.camera;
            }
            var objectScreenPos = objectOrGroup.getScreenXY(null, Phaser.Camera);
            this._point.x = X - camera.scroll.x * this.scrollFactor.x//copied from getScreenXY()
            ;
            this._point.y = Y - camera.scroll.y * this.scrollFactor.y;
            this._point.x += (this._point.x > 0) ? 0.0000001 : -0.0000001;
            this._point.y += (this._point.y > 0) ? 0.0000001 : -0.0000001;
            return (objectScreenPos.x + objectOrGroup.width > this._point.x) && (objectScreenPos.x < this._point.x + this.width) && (objectScreenPos.y + objectOrGroup.height > this._point.y) && (objectScreenPos.y < this._point.y + this.height);
        };
        GameObject.prototype.overlapsPoint = /**
        * Checks to see if a point in 2D world space overlaps this <code>GameObject</code>.
        *
        * @param point {Point} The point in world space you want to check.
        * @param inScreenSpace {boolean} Whether to take scroll factors into account when checking for overlap.
        * @param camera {Camera} Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return   Whether or not the point overlaps this object.
        */
        function (point, inScreenSpace, camera) {
            if (typeof inScreenSpace === "undefined") { inScreenSpace = false; }
            if (typeof camera === "undefined") { camera = null; }
            if(!inScreenSpace) {
                return (point.x > this.x) && (point.x < this.x + this.width) && (point.y > this.y) && (point.y < this.y + this.height);
            }
            if(camera == null) {
                camera = this._game.camera;
            }
            var X = point.x - camera.scroll.x;
            var Y = point.y - camera.scroll.y;
            this.getScreenXY(this._point, camera);
            return (X > this._point.x) && (X < this._point.x + this.width) && (Y > this._point.y) && (Y < this._point.y + this.height);
        };
        GameObject.prototype.onScreen = /**
        * Check and see if this object is currently on screen.
        *
        * @param camera {Camera} Specify which game camera you want. If null getScreenXY() will just grab the first global camera.
        *
        * @return {boolean} Whether the object is on screen or not.
        */
        function (camera) {
            if (typeof camera === "undefined") { camera = null; }
            if(camera == null) {
                camera = this._game.camera;
            }
            this.getScreenXY(this._point, camera);
            return (this._point.x + this.width > 0) && (this._point.x < camera.width) && (this._point.y + this.height > 0) && (this._point.y < camera.height);
        };
        GameObject.prototype.getScreenXY = /**
        * Call this to figure out the on-screen position of the object.
        *
        * @param point {Point} Takes a <code>MicroPoint</code> object and assigns the post-scrolled X and Y values of this object to it.
        * @param camera {Camera} Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return {MicroPoint} The <code>MicroPoint</code> you passed in, or a new <code>Point</code> if you didn't pass one, containing the screen X and Y position of this object.
        */
        function (point, camera) {
            if (typeof point === "undefined") { point = null; }
            if (typeof camera === "undefined") { camera = null; }
            if(point == null) {
                point = new Phaser.MicroPoint();
            }
            if(camera == null) {
                camera = this._game.camera;
            }
            point.x = this.x - camera.scroll.x * this.scrollFactor.x;
            point.y = this.y - camera.scroll.y * this.scrollFactor.y;
            point.x += (point.x > 0) ? 0.0000001 : -0.0000001;
            point.y += (point.y > 0) ? 0.0000001 : -0.0000001;
            return point;
        };
        Object.defineProperty(GameObject.prototype, "solid", {
            get: /**
            * Whether the object collides or not.  For more control over what directions
            * the object will collide from, use collision constants (like LEFT, FLOOR, etc)
            * to set the value of allowCollisions directly.
            */
            function () {
                return (this.allowCollisions & Phaser.Collision.ANY) > Phaser.Collision.NONE;
            },
            set: function (value) {
                if(value) {
                    this.allowCollisions = Phaser.Collision.ANY;
                } else {
                    this.allowCollisions = Phaser.Collision.NONE;
                }
            },
            enumerable: true,
            configurable: true
        });
        GameObject.prototype.getMidpoint = /**
        * Retrieve the midpoint of this object in world coordinates.
        *
        * @param point {Point} Allows you to pass in an existing <code>Point</code> object if you're so inclined.  Otherwise a new one is created.
        *
        * @return {MicroPoint} A <code>Point</code> object containing the midpoint of this object in world coordinates.
        */
        function (point) {
            if (typeof point === "undefined") { point = null; }
            if(point == null) {
                point = new Phaser.MicroPoint();
            }
            point.copyFrom(this.frameBounds.center);
            return point;
        };
        GameObject.prototype.reset = /**
        * Handy for reviving game objects.
        * Resets their existence flags and position.
        *
        * @param x {number} The new X position of this object.
        * @param y {number} The new Y position of this object.
        */
        function (x, y) {
            this.revive();
            this.touching = Phaser.Collision.NONE;
            this.wasTouching = Phaser.Collision.NONE;
            this.x = x;
            this.y = y;
            this.last.x = x;
            this.last.y = y;
            this.velocity.x = 0;
            this.velocity.y = 0;
        };
        GameObject.prototype.isTouching = /**
        * Handy for checking if this object is touching a particular surface.
        * For slightly better performance you can just &amp; the value directly into <code>touching</code>.
        * However, this method is good for readability and accessibility.
        *
        * @param Direction {number} Any of the collision flags (e.g. LEFT, FLOOR, etc).
        *
        * @return {boolean} Whether the object is touching an object in (any of) the specified direction(s) this frame.
        */
        function (direction) {
            return (this.touching & direction) > Phaser.Collision.NONE;
        };
        GameObject.prototype.justTouched = /**
        * Handy function for checking if this object just landed on a particular surface.
        *
        * @param Direction {number} Any of the collision flags (e.g. LEFT, FLOOR, etc).
        *
        * @returns {boolean} Whether the object just landed on any specicied surfaces.
        */
        function (direction) {
            return ((this.touching & direction) > Phaser.Collision.NONE) && ((this.wasTouching & direction) <= Phaser.Collision.NONE);
        };
        GameObject.prototype.hurt = /**
        * Reduces the "health" variable of this sprite by the amount specified in Damage.
        * Calls kill() if health drops to or below zero.
        *
        * @param Damage {number} How much health to take away (use a negative number to give a health bonus).
        */
        function (damage) {
            this.health = this.health - damage;
            if(this.health <= 0) {
                this.kill();
            }
        };
        GameObject.prototype.setBounds = /**
        * Set the world bounds that this GameObject can exist within. By default a GameObject can exist anywhere
        * in the world. But by setting the bounds (which are given in world dimensions, not screen dimensions)
        * it can be stopped from leaving the world, or a section of it.
        *
        * @param x {number} x position of the bound
        * @param y {number} y position of the bound
        * @param width {number} width of its bound
        * @param height {number} height of its bound
        */
        function (x, y, width, height) {
            this.worldBounds = new Phaser.Quad(x, y, width, height);
        };
        GameObject.prototype.setBoundsFromWorld = /**
        * Set the world bounds that this GameObject can exist within based on the size of the current game world.
        *
        * @param action {number} The action to take if the object hits the world bounds, either OUT_OF_BOUNDS_KILL or OUT_OF_BOUNDS_STOP
        */
        function (action) {
            if (typeof action === "undefined") { action = Phaser.GameObject.OUT_OF_BOUNDS_STOP; }
            this.setBounds(this._game.world.bounds.x, this._game.world.bounds.y, this._game.world.bounds.width, this._game.world.bounds.height);
            this.outOfBoundsAction = action;
        };
        GameObject.prototype.hideFromCamera = /**
        * If you do not wish this object to be visible to a specific camera, pass the camera here.
        *
        * @param camera {Camera} The specific camera.
        */
        function (camera) {
            if(this.cameraBlacklist.indexOf(camera.ID) == -1) {
                this.cameraBlacklist.push(camera.ID);
            }
        };
        GameObject.prototype.showToCamera = /**
        * Make this object only visible to a specific camera.
        *
        * @param camera {Camera} The camera you wish it to be visible.
        */
        function (camera) {
            if(this.cameraBlacklist.indexOf(camera.ID) !== -1) {
                this.cameraBlacklist.slice(this.cameraBlacklist.indexOf(camera.ID), 1);
            }
        };
        GameObject.prototype.clearCameraList = /**
        * This clears the camera black list, making the GameObject visible to all cameras.
        */
        function () {
            this.cameraBlacklist.length = 0;
        };
        GameObject.prototype.destroy = /**
        * Clean up memory.
        */
        function () {
        };
        GameObject.prototype.setPosition = function (x, y) {
            this.x = x;
            this.y = y;
        };
        Object.defineProperty(GameObject.prototype, "x", {
            get: function () {
                return this.frameBounds.x;
            },
            set: function (value) {
                this.frameBounds.x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "y", {
            get: function () {
                return this.frameBounds.y;
            },
            set: function (value) {
                this.frameBounds.y = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "rotation", {
            get: function () {
                return this._angle;
            },
            set: function (value) {
                this._angle = this._game.math.wrap(value, 360, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "angle", {
            get: function () {
                return this._angle;
            },
            set: function (value) {
                this._angle = this._game.math.wrap(value, 360, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "width", {
            get: function () {
                return this.frameBounds.width;
            },
            set: function (value) {
                this.frameBounds.width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "height", {
            get: function () {
                return this.frameBounds.height;
            },
            set: function (value) {
                this.frameBounds.height = value;
            },
            enumerable: true,
            configurable: true
        });
        return GameObject;
    })(Phaser.Basic);
    Phaser.GameObject = GameObject;    
})(Phaser || (Phaser = {}));
