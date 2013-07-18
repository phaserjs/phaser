var Phaser;
(function (Phaser) {
    var Motion = (function () {
        function Motion(game) {
            this._game = game;
        }
        Motion.prototype.computeVelocity = function (Velocity, Acceleration, Drag, Max) {
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
        Motion.prototype.velocityFromAngle = function (angle, speed) {
            if(isNaN(speed)) {
                speed = 0;
            }
            var a = this._game.math.degreesToRadians(angle);
            return new Phaser.Point((Math.cos(a) * speed), (Math.sin(a) * speed));
        };
        Motion.prototype.moveTowardsObject = function (source, dest, speed, maxTime) {
            if (typeof speed === "undefined") { speed = 60; }
            if (typeof maxTime === "undefined") { maxTime = 0; }
            var a = this.angleBetween(source, dest);
            if(maxTime > 0) {
                var d = this.distanceBetween(source, dest);
                speed = d / (maxTime / 1000);
            }
            source.velocity.x = Math.cos(a) * speed;
            source.velocity.y = Math.sin(a) * speed;
        };
        Motion.prototype.accelerateTowardsObject = function (source, dest, speed, xSpeedMax, ySpeedMax) {
            var a = this.angleBetween(source, dest);
            source.velocity.x = 0;
            source.velocity.y = 0;
            source.acceleration.x = Math.cos(a) * speed;
            source.acceleration.y = Math.sin(a) * speed;
            source.maxVelocity.x = xSpeedMax;
            source.maxVelocity.y = ySpeedMax;
        };
        Motion.prototype.moveTowardsMouse = function (source, speed, maxTime) {
            if (typeof speed === "undefined") { speed = 60; }
            if (typeof maxTime === "undefined") { maxTime = 0; }
            var a = this.angleBetweenMouse(source);
            if(maxTime > 0) {
                var d = this.distanceToMouse(source);
                speed = d / (maxTime / 1000);
            }
            source.velocity.x = Math.cos(a) * speed;
            source.velocity.y = Math.sin(a) * speed;
        };
        Motion.prototype.accelerateTowardsMouse = function (source, speed, xSpeedMax, ySpeedMax) {
            var a = this.angleBetweenMouse(source);
            source.velocity.x = 0;
            source.velocity.y = 0;
            source.acceleration.x = Math.cos(a) * speed;
            source.acceleration.y = Math.sin(a) * speed;
            source.maxVelocity.x = xSpeedMax;
            source.maxVelocity.y = ySpeedMax;
        };
        Motion.prototype.moveTowardsPoint = function (source, target, speed, maxTime) {
            if (typeof speed === "undefined") { speed = 60; }
            if (typeof maxTime === "undefined") { maxTime = 0; }
            var a = this.angleBetweenPoint(source, target);
            if(maxTime > 0) {
                var d = this.distanceToPoint(source, target);
                speed = d / (maxTime / 1000);
            }
            source.velocity.x = Math.cos(a) * speed;
            source.velocity.y = Math.sin(a) * speed;
        };
        Motion.prototype.accelerateTowardsPoint = function (source, target, speed, xSpeedMax, ySpeedMax) {
            var a = this.angleBetweenPoint(source, target);
            source.velocity.x = 0;
            source.velocity.y = 0;
            source.acceleration.x = Math.cos(a) * speed;
            source.acceleration.y = Math.sin(a) * speed;
            source.maxVelocity.x = xSpeedMax;
            source.maxVelocity.y = ySpeedMax;
        };
        Motion.prototype.distanceBetween = function (a, b) {
            var dx = (a.x + a.origin.x) - (b.x + b.origin.x);
            var dy = (a.y + a.origin.y) - (b.y + b.origin.y);
            return this._game.math.vectorLength(dx, dy);
        };
        Motion.prototype.distanceToPoint = function (a, target) {
            var dx = (a.x + a.origin.x) - (target.x);
            var dy = (a.y + a.origin.y) - (target.y);
            return this._game.math.vectorLength(dx, dy);
        };
        Motion.prototype.distanceToMouse = function (a) {
            var dx = (a.x + a.origin.x) - this._game.input.x;
            var dy = (a.y + a.origin.y) - this._game.input.y;
            return this._game.math.vectorLength(dx, dy);
        };
        Motion.prototype.angleBetweenPoint = function (a, target, asDegrees) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            var dx = (target.x) - (a.x + a.origin.x);
            var dy = (target.y) - (a.y + a.origin.y);
            if(asDegrees) {
                return this._game.math.radiansToDegrees(Math.atan2(dy, dx));
            } else {
                return Math.atan2(dy, dx);
            }
        };
        Motion.prototype.angleBetween = function (a, b, asDegrees) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            var dx = (b.x + b.origin.x) - (a.x + a.origin.x);
            var dy = (b.y + b.origin.y) - (a.y + a.origin.y);
            if(asDegrees) {
                return this._game.math.radiansToDegrees(Math.atan2(dy, dx));
            } else {
                return Math.atan2(dy, dx);
            }
        };
        Motion.prototype.velocityFromFacing = function (parent, speed) {
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
        Motion.prototype.angleBetweenMouse = function (a, asDegrees) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
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
