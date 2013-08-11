/// <reference path="Game.ts" />
/// <reference path="gameobjects/GameObject.ts" />
/**
* Phaser - Motion
*
* The Motion class contains lots of useful functions for moving game objects around in world space.
*/
var Phaser;
(function (Phaser) {
    var Motion = (function () {
        function Motion(game) {
            this._game = game;
        }
        Motion.prototype.computeVelocity = /**
        * A tween-like function that takes a starting velocity and some other factors and returns an altered velocity.
        *
        * @param {number} Velocity Any component of velocity (e.g. 20).
        * @param {number} Acceleration Rate at which the velocity is changing.
        * @param {number} Drag Really kind of a deceleration, this is how much the velocity changes if Acceleration is not set.
        * @param {number} Max An absolute value cap for the velocity.
        *
        * @return {number} The altered Velocity value.
        */
        function (Velocity, Acceleration, Drag, Max) {
            if (typeof Acceleration === "undefined") { Acceleration = 0; }
            if (typeof Drag === "undefined") { Drag = 0; }
            if (typeof Max === "undefined") { Max = 10000; }
            if(Acceleration !== 0) {
                Velocity += Acceleration * this._game.time.elapsed;
            } else if(Drag !== 0) {
                var drag = Drag * this._game.time.elapsed;
                if(Velocity - drag > 0) {
                    Velocity = Velocity - drag;
                } else if(Velocity + drag < 0) {
                    Velocity += drag;
                } else {
                    Velocity = 0;
                }
            }
            if((Velocity != 0) && (Max != 10000)) {
                if(Velocity > Max) {
                    Velocity = Max;
                } else if(Velocity < -Max) {
                    Velocity = -Max;
                }
            }
            return Velocity;
        };
        Motion.prototype.velocityFromAngle = /**
        * Given the angle and speed calculate the velocity and return it as a Point
        *
        * @param {number} angle The angle (in degrees) calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        * @param {number} speed The speed it will move, in pixels per second sq
        *
        * @return {Point} A Point where Point.x contains the velocity x value and Point.y contains the velocity y value
        */
        function (angle, speed) {
            if(isNaN(speed)) {
                speed = 0;
            }
            var a = this._game.math.degreesToRadians(angle);
            return new Phaser.Point((Math.cos(a) * speed), (Math.sin(a) * speed));
        };
        Motion.prototype.moveTowardsObject = /**
        * Sets the source Sprite x/y velocity so it will move directly towards the destination Sprite at the speed given (in pixels per second)<br>
        * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
        * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
        * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
        * If you need the object to accelerate, see accelerateTowardsObject() instead
        * Note: Doesn't take into account acceleration, maxVelocity or drag (if you set drag or acceleration too high this object may not move at all)
        *
        * @param {GameObject} source The Sprite on which the velocity will be set
        * @param {GameObject} dest The Sprite where the source object will move to
        * @param {number} speed The speed it will move, in pixels per second (default is 60 pixels/sec)
        * @param {number} maxTime Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
        */
        function (source, dest, speed, maxTime) {
            if (typeof speed === "undefined") { speed = 60; }
            if (typeof maxTime === "undefined") { maxTime = 0; }
            var a = this.angleBetween(source, dest);
            if(maxTime > 0) {
                var d = this.distanceBetween(source, dest);
                //	We know how many pixels we need to move, but how fast?
                speed = d / (maxTime / 1000);
            }
            source.velocity.x = Math.cos(a) * speed;
            source.velocity.y = Math.sin(a) * speed;
        };
        Motion.prototype.accelerateTowardsObject = /**
        * Sets the x/y acceleration on the source Sprite so it will move towards the destination Sprite at the speed given (in pixels per second)<br>
        * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
        * If you don't need acceleration look at moveTowardsObject() instead.
        *
        * @param {GameObject} source The Sprite on which the acceleration will be set
        * @param {GameObject} dest The Sprite where the source object will move towards
        * @param {number} speed The speed it will accelerate in pixels per second
        * @param {number} xSpeedMax The maximum speed in pixels per second in which the sprite can move horizontally
        * @param {number} ySpeedMax The maximum speed in pixels per second in which the sprite can move vertically
        */
        function (source, dest, speed, xSpeedMax, ySpeedMax) {
            var a = this.angleBetween(source, dest);
            source.velocity.x = 0;
            source.velocity.y = 0;
            source.acceleration.x = Math.cos(a) * speed;
            source.acceleration.y = Math.sin(a) * speed;
            source.maxVelocity.x = xSpeedMax;
            source.maxVelocity.y = ySpeedMax;
        };
        Motion.prototype.moveTowardsMouse = /**
        * Move the given Sprite towards the mouse pointer coordinates at a steady velocity
        * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
        * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
        * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
        *
        * @param {GameObject} source The Sprite to move
        * @param {number} speed The speed it will move, in pixels per second (default is 60 pixels/sec)
        * @param {number} maxTime Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
        */
        function (source, speed, maxTime) {
            if (typeof speed === "undefined") { speed = 60; }
            if (typeof maxTime === "undefined") { maxTime = 0; }
            var a = this.angleBetweenMouse(source);
            if(maxTime > 0) {
                var d = this.distanceToMouse(source);
                //	We know how many pixels we need to move, but how fast?
                speed = d / (maxTime / 1000);
            }
            source.velocity.x = Math.cos(a) * speed;
            source.velocity.y = Math.sin(a) * speed;
        };
        Motion.prototype.accelerateTowardsMouse = /**
        * Sets the x/y acceleration on the source Sprite so it will move towards the mouse coordinates at the speed given (in pixels per second)<br>
        * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
        * If you don't need acceleration look at moveTowardsMouse() instead.
        *
        * @param {GameObject} source The Sprite on which the acceleration will be set
        * @param {number} speed The speed it will accelerate in pixels per second
        * @param {number} xSpeedMax The maximum speed in pixels per second in which the sprite can move horizontally
        * @param {number} ySpeedMax The maximum speed in pixels per second in which the sprite can move vertically
        */
        function (source, speed, xSpeedMax, ySpeedMax) {
            var a = this.angleBetweenMouse(source);
            source.velocity.x = 0;
            source.velocity.y = 0;
            source.acceleration.x = Math.cos(a) * speed;
            source.acceleration.y = Math.sin(a) * speed;
            source.maxVelocity.x = xSpeedMax;
            source.maxVelocity.y = ySpeedMax;
        };
        Motion.prototype.moveTowardsPoint = /**
        * Sets the x/y velocity on the source Sprite so it will move towards the target coordinates at the speed given (in pixels per second)<br>
        * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
        * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
        * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
        *
        * @param {GameObject} source The Sprite to move
        * @param {Point} target The Point coordinates to move the source Sprite towards
        * @param {number} speed The speed it will move, in pixels per second (default is 60 pixels/sec)
        * @param {number} maxTime Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
        */
        function (source, target, speed, maxTime) {
            if (typeof speed === "undefined") { speed = 60; }
            if (typeof maxTime === "undefined") { maxTime = 0; }
            var a = this.angleBetweenPoint(source, target);
            if(maxTime > 0) {
                var d = this.distanceToPoint(source, target);
                //	We know how many pixels we need to move, but how fast?
                speed = d / (maxTime / 1000);
            }
            source.velocity.x = Math.cos(a) * speed;
            source.velocity.y = Math.sin(a) * speed;
        };
        Motion.prototype.accelerateTowardsPoint = /**
        * Sets the x/y acceleration on the source Sprite so it will move towards the target coordinates at the speed given (in pixels per second)<br>
        * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
        * If you don't need acceleration look at moveTowardsPoint() instead.
        *
        * @param {GameObject} source The Sprite on which the acceleration will be set
        * @param {Point} target The Point coordinates to move the source Sprite towards
        * @param {number} speed The speed it will accelerate in pixels per second
        * @param {number} xSpeedMax The maximum speed in pixels per second in which the sprite can move horizontally
        * @param {number} ySpeedMax The maximum speed in pixels per second in which the sprite can move vertically
        */
        function (source, target, speed, xSpeedMax, ySpeedMax) {
            var a = this.angleBetweenPoint(source, target);
            source.velocity.x = 0;
            source.velocity.y = 0;
            source.acceleration.x = Math.cos(a) * speed;
            source.acceleration.y = Math.sin(a) * speed;
            source.maxVelocity.x = xSpeedMax;
            source.maxVelocity.y = ySpeedMax;
        };
        Motion.prototype.distanceBetween = /**
        * Find the distance (in pixels, rounded) between two Sprites, taking their origin into account
        *
        * @param {GameObject} a The first Sprite
        * @param {GameObject} b The second Sprite
        * @return {number} int Distance (in pixels)
        */
        function (a, b) {
            var dx = (a.x + a.origin.x) - (b.x + b.origin.x);
            var dy = (a.y + a.origin.y) - (b.y + b.origin.y);
            return this._game.math.vectorLength(dx, dy);
        };
        Motion.prototype.distanceToPoint = /**
        * Find the distance (in pixels, rounded) from an Sprite to the given Point, taking the source origin into account
        *
        * @param {GameObject} a The Sprite
        * @param {Point} target The Point
        * @return {number} Distance (in pixels)
        */
        function (a, target) {
            var dx = (a.x + a.origin.x) - (target.x);
            var dy = (a.y + a.origin.y) - (target.y);
            return this._game.math.vectorLength(dx, dy);
        };
        Motion.prototype.distanceToMouse = /**
        * Find the distance (in pixels, rounded) from the object x/y and the mouse x/y
        *
        * @param {GameObject} a  Sprite to test against
        * @return {number} The distance between the given sprite and the mouse coordinates
        */
        function (a) {
            var dx = (a.x + a.origin.x) - this._game.input.x;
            var dy = (a.y + a.origin.y) - this._game.input.y;
            return this._game.math.vectorLength(dx, dy);
        };
        Motion.prototype.angleBetweenPoint = /**
        * Find the angle (in radians) between an Sprite and an Point. The source sprite takes its x/y and origin into account.
        * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        *
        * @param {GameObject} a The Sprite to test from
        * @param {Point} target The Point to angle the Sprite towards
        * @param {boolean} asDegrees If you need the value in degrees instead of radians, set to true
        *
        * @return {number} The angle (in radians unless asDegrees is true)
        */
        function (a, target, asDegrees) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            var dx = (target.x) - (a.x + a.origin.x);
            var dy = (target.y) - (a.y + a.origin.y);
            if(asDegrees) {
                return this._game.math.radiansToDegrees(Math.atan2(dy, dx));
            } else {
                return Math.atan2(dy, dx);
            }
        };
        Motion.prototype.angleBetween = /**
        * Find the angle (in radians) between the two Sprite, taking their x/y and origin into account.
        * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        *
        * @param {GameObject} a The Sprite to test from
        * @param {GameObject} b The Sprite to test to
        * @param {boolean} asDegrees If you need the value in degrees instead of radians, set to true
        *
        * @return {number} The angle (in radians unless asDegrees is true)
        */
        function (a, b, asDegrees) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            var dx = (b.x + b.origin.x) - (a.x + a.origin.x);
            var dy = (b.y + b.origin.y) - (a.y + a.origin.y);
            if(asDegrees) {
                return this._game.math.radiansToDegrees(Math.atan2(dy, dx));
            } else {
                return Math.atan2(dy, dx);
            }
        };
        Motion.prototype.velocityFromFacing = /**
        * Given the GameObject and speed calculate the velocity and return it as an Point based on the direction the sprite is facing
        *
        * @param {GameObject} parent The Sprite to get the facing value from
        * @param {number} speed The speed it will move, in pixels per second sq
        *
        * @return {Point} An Point where Point.x contains the velocity x value and Point.y contains the velocity y value
        */
        function (parent, speed) {
            var a;
            if(parent.facing == Phaser.Collision.LEFT) {
                a = this._game.math.degreesToRadians(180);
            } else if(parent.facing == Phaser.Collision.RIGHT) {
                a = this._game.math.degreesToRadians(0);
            } else if(parent.facing == Phaser.Collision.UP) {
                a = this._game.math.degreesToRadians(-90);
            } else if(parent.facing == Phaser.Collision.DOWN) {
                a = this._game.math.degreesToRadians(90);
            }
            return new Phaser.Point(Math.cos(a) * speed, Math.sin(a) * speed);
        };
        Motion.prototype.angleBetweenMouse = /**
        * Find the angle (in radians) between an Sprite and the mouse, taking their x/y and origin into account.
        * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        *
        * @param {GameObject} a The Object to test from
        * @param {boolean} asDegrees If you need the value in degrees instead of radians, set to true
        *
        * @return {number} The angle (in radians unless asDegrees is true)
        */
        function (a, asDegrees) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            //	In order to get the angle between the object and mouse, we need the objects screen coordinates (rather than world coordinates)
            var p = a.getScreenXY();
            var dx = a._game.input.x - p.x;
            var dy = a._game.input.y - p.y;
            if(asDegrees) {
                return this._game.math.radiansToDegrees(Math.atan2(dy, dx));
            } else {
                return Math.atan2(dy, dx);
            }
        };
        return Motion;
    })();
    Phaser.Motion = Motion;    
})(Phaser || (Phaser = {}));
