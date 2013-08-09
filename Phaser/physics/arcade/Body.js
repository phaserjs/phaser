var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - ArcadePhysics - Body
    */
    (function (Physics) {
        var Body = (function () {
            function Body(sprite, type) {
                this.angularVelocity = 0;
                this.angularAcceleration = 0;
                this.angularDrag = 0;
                this.maxAngular = 10000;
                this.mass = 1;
                this._width = 0;
                this._height = 0;
                this.sprite = sprite;
                this.game = sprite.game;
                this.type = type;

                //  Fixture properties
                //  Will extend into its own class at a later date - can move the fixture defs there and add shape support, but this will do for 1.0 release
                this.bounds = new Phaser.Rectangle();

                this._width = sprite.width;
                this._height = sprite.height;

                //  Body properties
                //this.gravity = Vec2Utils.clone(ArcadePhysics.gravity);
                //this.bounce = Vec2Utils.clone(ArcadePhysics.bounce);
                this.velocity = new Phaser.Vec2();
                this.acceleration = new Phaser.Vec2();

                //this.drag = Vec2Utils.clone(ArcadePhysics.drag);
                this.maxVelocity = new Phaser.Vec2(10000, 10000);

                this.angularVelocity = 0;
                this.angularAcceleration = 0;
                this.angularDrag = 0;

                this.touching = Phaser.Types.NONE;
                this.wasTouching = Phaser.Types.NONE;
                this.allowCollisions = Phaser.Types.ANY;

                this.position = new Phaser.Vec2(sprite.x + this.bounds.halfWidth, sprite.y + this.bounds.halfHeight);
                this.oldPosition = new Phaser.Vec2(sprite.x + this.bounds.halfWidth, sprite.y + this.bounds.halfHeight);
                this.offset = new Phaser.Vec2();
            }
            Object.defineProperty(Body.prototype, "x", {
                get: function () {
                    return this.sprite.x + this.offset.x;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Body.prototype, "y", {
                get: function () {
                    return this.sprite.y + this.offset.y;
                },
                enumerable: true,
                configurable: true
            });



            Object.defineProperty(Body.prototype, "width", {
                get: function () {
                    return this._width * this.sprite.transform.scale.x;
                },
                set: function (value) {
                    this._width = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Body.prototype, "height", {
                get: function () {
                    return this._height * this.sprite.transform.scale.y;
                },
                set: function (value) {
                    this._height = value;
                },
                enumerable: true,
                configurable: true
            });

            Body.prototype.preUpdate = function () {
                this.oldPosition.copyFrom(this.position);

                this.bounds.x = this.x;
                this.bounds.y = this.y;
                this.bounds.width = this.width;
                this.bounds.height = this.height;
            };

            //  Shall we do this? Or just update the values directly in the separate functions? But then the bounds will be out of sync - as long as
            //  the bounds are updated and used in calculations then we can do one final sprite movement here I guess?
            Body.prototype.postUpdate = function () {
                if (this.type !== Phaser.Types.BODY_DISABLED) {
                    //this.game.world.physics.updateMotion(this);
                    this.wasTouching = this.touching;
                    this.touching = Phaser.Types.NONE;
                }

                this.position.setTo(this.x, this.y);
            };

            Object.defineProperty(Body.prototype, "hullWidth", {
                get: function () {
                    if (this.deltaX > 0) {
                        return this.bounds.width + this.deltaX;
                    } else {
                        return this.bounds.width - this.deltaX;
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Body.prototype, "hullHeight", {
                get: function () {
                    if (this.deltaY > 0) {
                        return this.bounds.height + this.deltaY;
                    } else {
                        return this.bounds.height - this.deltaY;
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Body.prototype, "hullX", {
                get: function () {
                    if (this.position.x < this.oldPosition.x) {
                        return this.position.x;
                    } else {
                        return this.oldPosition.x;
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Body.prototype, "hullY", {
                get: function () {
                    if (this.position.y < this.oldPosition.y) {
                        return this.position.y;
                    } else {
                        return this.oldPosition.y;
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Body.prototype, "deltaXAbs", {
                get: function () {
                    return (this.deltaX > 0 ? this.deltaX : -this.deltaX);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Body.prototype, "deltaYAbs", {
                get: function () {
                    return (this.deltaY > 0 ? this.deltaY : -this.deltaY);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Body.prototype, "deltaX", {
                get: function () {
                    return this.position.x - this.oldPosition.x;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Body.prototype, "deltaY", {
                get: function () {
                    return this.position.y - this.oldPosition.y;
                },
                enumerable: true,
                configurable: true
            });
            return Body;
        })();
        Physics.Body = Body;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
