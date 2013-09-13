var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    /**
    * Phaser - Physics - PhysicsManager
    */
    (function (Physics) {
        var PhysicsManager = (function () {
            function PhysicsManager(game) {
                this._length = 0;
                //public bounds: Rectangle;
                //public gravity: Vec2;
                //public drag: Vec2;
                //public bounce: Vec2;
                //public angularDrag: number;
                this.grav = 0.2;
                this.drag = 1;
                this.bounce = 0.3;
                this.friction = 0.05;
                this.min_f = 0;
                this.max_f = 1;
                this.min_b = 0;
                this.max_b = 1;
                this.min_g = 0;
                this.max_g = 1;
                this.xmin = 0;
                this.xmax = 800;
                this.ymin = 0;
                this.ymax = 600;
                this.objrad = 24;
                this.tilerad = 24 * 2;
                this.objspeed = 0.2;
                this.maxspeed = 20;
                this.game = game;
                //this.gravity = new Vec2;
                //this.drag = new Vec2;
                //this.bounce = new Vec2;
                //this.angularDrag = 0;
                //this.bounds = new Rectangle(0, 0, width, height);
                //this._distance = new Vec2;
                //this._tangent = new Vec2;
                            }
            PhysicsManager.prototype.update = function () {
            };
            PhysicsManager.prototype.updateMotion = function (body) {
                this._velocityDelta = (this.computeVelocity(body.angularVelocity, body.gravity.x, body.angularAcceleration, body.angularDrag, body.maxAngular) - body.angularVelocity) / 2;
                body.angularVelocity += this._velocityDelta;
                body.sprite.transform.rotation += body.angularVelocity * this.game.time.physicsElapsed;
                body.angularVelocity += this._velocityDelta;
                this._velocityDelta = (this.computeVelocity(body.velocity.x, body.gravity.x, body.acceleration.x, body.drag.x) - body.velocity.x) / 2;
                body.velocity.x += this._velocityDelta;
                this._delta = body.velocity.x * this.game.time.physicsElapsed;
                body.aabb.pos.x += this._delta;
                body.deltaX = this._delta;
                this._velocityDelta = (this.computeVelocity(body.velocity.y, body.gravity.y, body.acceleration.y, body.drag.y) - body.velocity.y) / 2;
                body.velocity.y += this._velocityDelta;
                this._delta = body.velocity.y * this.game.time.physicsElapsed;
                body.aabb.pos.y += this._delta;
                body.deltaY = this._delta;
                //body.aabb.integrateVerlet();
                            };
            PhysicsManager.prototype.computeVelocity = /**
            * A tween-like function that takes a starting velocity and some other factors and returns an altered velocity.
            *
            * @param {number} Velocity Any component of velocity (e.g. 20).
            * @param {number} Acceleration Rate at which the velocity is changing.
            * @param {number} Drag Really kind of a deceleration, this is how much the velocity changes if Acceleration is not set.
            * @param {number} Max An absolute value cap for the velocity.
            *
            * @return {number} The altered Velocity value.
            */
            function (velocity, gravity, acceleration, drag, max) {
                if (typeof gravity === "undefined") { gravity = 0; }
                if (typeof acceleration === "undefined") { acceleration = 0; }
                if (typeof drag === "undefined") { drag = 0; }
                if (typeof max === "undefined") { max = 10000; }
                if(acceleration !== 0) {
                    velocity += (acceleration + gravity) * this.game.time.physicsElapsed;
                } else if(drag !== 0) {
                    this._drag = drag * this.game.time.physicsElapsed;
                    if(velocity - this._drag > 0) {
                        velocity = velocity - this._drag;
                    } else if(velocity + this._drag < 0) {
                        velocity += this._drag;
                    } else {
                        velocity = 0;
                    }
                }
                //velocity += gravity;
                if(velocity != 0) {
                    if(velocity > max) {
                        velocity = max;
                    } else if(velocity < -max) {
                        velocity = -max;
                    }
                }
                return velocity;
            };
            return PhysicsManager;
        })();
        Physics.PhysicsManager = PhysicsManager;        
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
