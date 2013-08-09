/// <reference path="../../Game.ts" />
/// <reference path="../../gameobjects/Sprite.ts" />
/**
* Phaser - Motion
*
* The Motion class contains lots of useful functions for moving game objects around in world space.
*/
var Phaser;
(function (Phaser) {
    var Motion = (function () {
        function Motion(game) {
            this.game = game;
        }
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
            var a = this.game.math.degreesToRadians(angle);
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
        * @param {Sprite} source The Sprite on which the velocity will be set
        * @param {Sprite} dest The Sprite where the source object will move to
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
            source.body.velocity.x = Math.cos(a) * speed;
            source.body.velocity.y = Math.sin(a) * speed;
        };
        Motion.prototype.accelerateTowardsObject = /**
        * Sets the x/y acceleration on the source Sprite so it will move towards the destination Sprite at the speed given (in pixels per second)<br>
        * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
        * If you don't need acceleration look at moveTowardsObject() instead.
        *
        * @param {Sprite} source The Sprite on which the acceleration will be set
        * @param {Sprite} dest The Sprite where the source object will move towards
        * @param {number} speed The speed it will accelerate in pixels per second
        * @param {number} xSpeedMax The maximum speed in pixels per second in which the sprite can move horizontally
        * @param {number} ySpeedMax The maximum speed in pixels per second in which the sprite can move vertically
        */
        function (source, dest, speed, xSpeedMax, ySpeedMax) {
            /*
            var a: number = this.angleBetween(source, dest);
            
            source.body.velocity.x = 0;
            source.body.velocity.y = 0;
            
            source.body.acceleration.x = Math.cos(a) * speed;
            source.body.acceleration.y = Math.sin(a) * speed;
            
            source.body.maxVelocity.x = xSpeedMax;
            source.body.maxVelocity.y = ySpeedMax;
            */
                    };
        Motion.prototype.moveTowardsMouse = /**
        * Move the given Sprite towards the mouse pointer coordinates at a steady velocity
        * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
        * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
        * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
        *
        * @param {Sprite} source The Sprite to move
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
            source.body.velocity.x = Math.cos(a) * speed;
            source.body.velocity.y = Math.sin(a) * speed;
        };
        Motion.prototype.accelerateTowardsMouse = /**
        * Sets the x/y acceleration on the source Sprite so it will move towards the mouse coordinates at the speed given (in pixels per second)<br>
        * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
        * If you don't need acceleration look at moveTowardsMouse() instead.
        *
        * @param {Sprite} source The Sprite on which the acceleration will be set
        * @param {number} speed The speed it will accelerate in pixels per second
        * @param {number} xSpeedMax The maximum speed in pixels per second in which the sprite can move horizontally
        * @param {number} ySpeedMax The maximum speed in pixels per second in which the sprite can move vertically
        */
        function (source, speed, xSpeedMax, ySpeedMax) {
            /*
            var a: number = this.angleBetweenMouse(source);
            
            source.body.velocity.x = 0;
            source.body.velocity.y = 0;
            
            source.body.acceleration.x = Math.cos(a) * speed;
            source.body.acceleration.y = Math.sin(a) * speed;
            
            source.body.maxVelocity.x = xSpeedMax;
            source.body.maxVelocity.y = ySpeedMax;
            */
                    };
        Motion.prototype.moveTowardsPoint = /**
        * Sets the x/y velocity on the source Sprite so it will move towards the target coordinates at the speed given (in pixels per second)<br>
        * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
        * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
        * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
        *
        * @param {Sprite} source The Sprite to move
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
            source.body.velocity.x = Math.cos(a) * speed;
            source.body.velocity.y = Math.sin(a) * speed;
        };
        Motion.prototype.accelerateTowardsPoint = /**
        * Sets the x/y acceleration on the source Sprite so it will move towards the target coordinates at the speed given (in pixels per second)<br>
        * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
        * If you don't need acceleration look at moveTowardsPoint() instead.
        *
        * @param {Sprite} source The Sprite on which the acceleration will be set
        * @param {Point} target The Point coordinates to move the source Sprite towards
        * @param {number} speed The speed it will accelerate in pixels per second
        * @param {number} xSpeedMax The maximum speed in pixels per second in which the sprite can move horizontally
        * @param {number} ySpeedMax The maximum speed in pixels per second in which the sprite can move vertically
        */
        function (source, target, speed, xSpeedMax, ySpeedMax) {
            /*
            var a: number = this.angleBetweenPoint(source, target);
            
            source.body.velocity.x = 0;
            source.body.velocity.y = 0;
            
            source.body.acceleration.x = Math.cos(a) * speed;
            source.body.acceleration.y = Math.sin(a) * speed;
            
            source.body.maxVelocity.x = xSpeedMax;
            source.body.maxVelocity.y = ySpeedMax;
            */
                    };
        Motion.prototype.distanceBetween = /**
        * Find the distance between two Sprites, taking their origin into account
        *
        * @param {Sprite} a The first Sprite
        * @param {Sprite} b The second Sprite
        * @return {number} int Distance (in pixels)
        */
        function (a, b) {
            return Phaser.Vec2Utils.distance(a.body.position, b.body.position);
        };
        Motion.prototype.distanceToPoint = /**
        * Find the distance from an Sprite to the given Point, taking the source origin into account
        *
        * @param {Sprite} a The Sprite
        * @param {Point} target The Point
        * @return {number} Distance (in pixels)
        */
        function (a, target) {
            var dx = (a.x + a.transform.origin.x) - (target.x);
            var dy = (a.y + a.transform.origin.y) - (target.y);
            return this.game.math.vectorLength(dx, dy);
        };
        Motion.prototype.distanceToMouse = /**
        * Find the distance (in pixels, rounded) from the object x/y and the mouse x/y
        *
        * @param {Sprite} a  Sprite to test against
        * @return {number} The distance between the given sprite and the mouse coordinates
        */
        function (a) {
            var dx = (a.x + a.transform.origin.x) - this.game.input.x;
            var dy = (a.y + a.transform.origin.y) - this.game.input.y;
            return this.game.math.vectorLength(dx, dy);
        };
        Motion.prototype.angleBetweenPoint = /**
        * Find the angle (in radians) between an Sprite and an Point. The source sprite takes its x/y and origin into account.
        * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        *
        * @param {Sprite} a The Sprite to test from
        * @param {Point} target The Point to angle the Sprite towards
        * @param {boolean} asDegrees If you need the value in degrees instead of radians, set to true
        *
        * @return {number} The angle (in radians unless asDegrees is true)
        */
        function (a, target, asDegrees) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            var dx = (target.x) - (a.x + a.transform.origin.x);
            var dy = (target.y) - (a.y + a.transform.origin.y);
            if(asDegrees) {
                return this.game.math.radiansToDegrees(Math.atan2(dy, dx));
            } else {
                return Math.atan2(dy, dx);
            }
        };
        Motion.prototype.angleBetween = /**
        * Find the angle (in radians) between the two Sprite, taking their x/y and origin into account.
        * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        *
        * @param {Sprite} a The Sprite to test from
        * @param {Sprite} b The Sprite to test to
        * @param {boolean} asDegrees If you need the value in degrees instead of radians, set to true
        *
        * @return {number} The angle (in radians unless asDegrees is true)
        */
        function (a, b, asDegrees) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            var dx = (b.x + b.transform.origin.x) - (a.x + a.transform.origin.x);
            var dy = (b.y + b.transform.origin.y) - (a.y + a.transform.origin.y);
            if(asDegrees) {
                return this.game.math.radiansToDegrees(Math.atan2(dy, dx));
            } else {
                return Math.atan2(dy, dx);
            }
        };
        Motion.prototype.velocityFromFacing = /**
        * Given the Sprite and speed calculate the velocity and return it as an Point based on the direction the sprite is facing
        *
        * @param {Sprite} parent The Sprite to get the facing value from
        * @param {number} speed The speed it will move, in pixels per second sq
        *
        * @return {Point} An Point where Point.x contains the velocity x value and Point.y contains the velocity y value
        */
        function (parent, speed) {
            /*
            var a: number;
            
            if (parent.body.facing == Types.LEFT)
            {
            a = this.game.math.degreesToRadians(180);
            }
            else if (parent.body.facing == Types.RIGHT)
            {
            a = this.game.math.degreesToRadians(0);
            }
            else if (parent.body.facing == Types.UP)
            {
            a = this.game.math.degreesToRadians(-90);
            }
            else if (parent.body.facing == Types.DOWN)
            {
            a = this.game.math.degreesToRadians(90);
            }
            
            return new Point(Math.cos(a) * speed, Math.sin(a) * speed);
            */
            return new Phaser.Point();
        };
        Motion.prototype.angleBetweenMouse = /**
        * Find the angle (in radians) between an Sprite and the mouse, taking their x/y and origin into account.
        * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        *
        * @param {Sprite} a The Object to test from
        * @param {boolean} asDegrees If you need the value in degrees instead of radians, set to true
        *
        * @return {number} The angle (in radians unless asDegrees is true)
        */
        function (a, asDegrees) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            //	In order to get the angle between the object and mouse, we need the objects screen coordinates (rather than world coordinates)
            var p = Phaser.SpriteUtils.getScreenXY(a);
            var dx = a.game.input.x - p.x;
            var dy = a.game.input.y - p.y;
            if(asDegrees) {
                return this.game.math.radiansToDegrees(Math.atan2(dy, dx));
            } else {
                return Math.atan2(dy, dx);
            }
        };
        return Motion;
    })();
    Phaser.Motion = Motion;    
})(Phaser || (Phaser = {}));
