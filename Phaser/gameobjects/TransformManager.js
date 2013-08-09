var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    /**
    * Phaser - Components - TransformManager
    */
    (function (Components) {
        var TransformManager = (function () {
            /**
            * Creates a new TransformManager component
            * @param parent The game object using this transform
            */
            function TransformManager(parent) {
                this._dirty = false;
                /**
                * This value is added to the rotation of the object.
                * For example if you had a texture drawn facing straight up then you could set
                * rotationOffset to 90 and it would correspond correctly with Phasers right-handed coordinate system.
                * @type {number}
                */
                this.rotationOffset = 0;
                /**
                * The rotation of the object in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
                */
                this.rotation = 0;
                this.game = parent.game;
                this.parent = parent;

                this.local = new Phaser.Mat3();

                this.scrollFactor = new Phaser.Vec2(1, 1);
                this.origin = new Phaser.Vec2();
                this.scale = new Phaser.Vec2(1, 1);
                this.skew = new Phaser.Vec2();

                this.center = new Phaser.Point();
                this.upperLeft = new Phaser.Point();
                this.upperRight = new Phaser.Point();
                this.bottomLeft = new Phaser.Point();
                this.bottomRight = new Phaser.Point();

                this._pos = new Phaser.Point();
                this._scale = new Phaser.Point();
                this._size = new Phaser.Point();
                this._halfSize = new Phaser.Point();
                this._offset = new Phaser.Point();
                this._origin = new Phaser.Point();
                this._sc = new Phaser.Point();
                this._scA = new Phaser.Point();
            }
            Object.defineProperty(TransformManager.prototype, "distance", {
                get: /**
                * The distance from the center of the transform to the rotation origin.
                */
                function () {
                    return this._distance;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TransformManager.prototype, "angleToCenter", {
                get: /**
                * The angle between the center of the transform to the rotation origin.
                */
                function () {
                    return this._angle;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TransformManager.prototype, "offsetX", {
                get: /**
                * The offset on the X axis of the origin That is the difference between the top left of the Sprite and the origin.x.
                * So if the origin.x is 0 the offsetX will be 0. If the origin.x is 0.5 then offsetX will be sprite width / 2, and so on.
                */
                function () {
                    return this._offset.x;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TransformManager.prototype, "offsetY", {
                get: /**
                * The offset on the Y axis of the origin
                */
                function () {
                    return this._offset.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TransformManager.prototype, "halfWidth", {
                get: /**
                * Half the width of the parent sprite, taking into consideration scaling
                */
                function () {
                    return this._halfSize.x;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TransformManager.prototype, "halfHeight", {
                get: /**
                * Half the height of the parent sprite, taking into consideration scaling
                */
                function () {
                    return this._halfSize.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TransformManager.prototype, "sin", {
                get: /**
                * The equivalent of Math.sin(rotation + rotationOffset)
                */
                function () {
                    return this._sc.x;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TransformManager.prototype, "cos", {
                get: /**
                * The equivalent of Math.cos(rotation + rotationOffset)
                */
                function () {
                    return this._sc.y;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Moves the sprite so its center is located on the given x and y coordinates.
            * Doesn't change the origin of the sprite.
            */
            TransformManager.prototype.centerOn = function (x, y) {
                this.parent.x = x + (this.parent.x - this.center.x);
                this.parent.y = y + (this.parent.y - this.center.y);

                this.setCache();
            };

            /**
            * Populates the transform cache. Called by the parent object on creation.
            */
            TransformManager.prototype.setCache = function () {
                this._pos.x = this.parent.x;
                this._pos.y = this.parent.y;
                this._halfSize.x = this.parent.width / 2;
                this._halfSize.y = this.parent.height / 2;
                this._offset.x = this.origin.x * this.parent.width;
                this._offset.y = this.origin.y * this.parent.height;
                this._angle = Math.atan2(this.halfHeight - this._offset.x, this.halfWidth - this._offset.y);
                this._distance = Math.sqrt(((this._offset.x - this._halfSize.x) * (this._offset.x - this._halfSize.x)) + ((this._offset.y - this._halfSize.y) * (this._offset.y - this._halfSize.y)));
                this._size.x = this.parent.width;
                this._size.y = this.parent.height;
                this._origin.x = this.origin.x;
                this._origin.y = this.origin.y;
                this._sc.x = Math.sin((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
                this._sc.y = Math.cos((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
                this._scA.y = Math.cos((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD + this._angle);
                this._scA.x = Math.sin((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD + this._angle);
                this._prevRotation = this.rotation;

                if (this.parent.texture && this.parent.texture.renderRotation) {
                    this._sc.x = Math.sin((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
                    this._sc.y = Math.cos((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
                } else {
                    this._sc.x = 0;
                    this._sc.y = 1;
                }

                this.center.x = this.parent.x + this._distance * this._scA.y;
                this.center.y = this.parent.y + this._distance * this._scA.x;

                this.upperLeft.setTo(this.center.x - this._halfSize.x * this._sc.y + this._halfSize.y * this._sc.x, this.center.y - this._halfSize.y * this._sc.y - this._halfSize.x * this._sc.x);
                this.upperRight.setTo(this.center.x + this._halfSize.x * this._sc.y + this._halfSize.y * this._sc.x, this.center.y - this._halfSize.y * this._sc.y + this._halfSize.x * this._sc.x);
                this.bottomLeft.setTo(this.center.x - this._halfSize.x * this._sc.y - this._halfSize.y * this._sc.x, this.center.y + this._halfSize.y * this._sc.y - this._halfSize.x * this._sc.x);
                this.bottomRight.setTo(this.center.x + this._halfSize.x * this._sc.y - this._halfSize.y * this._sc.x, this.center.y + this._halfSize.y * this._sc.y + this._halfSize.x * this._sc.x);

                this._pos.x = this.parent.x;
                this._pos.y = this.parent.y;
            };

            /**
            * Updates the local transform matrix and the cache values if anything has changed in the parent.
            */
            TransformManager.prototype.update = function () {
                //  Check cache
                this._dirty = false;

                if (this.parent.width !== this._size.x || this.parent.height !== this._size.y || this.origin.x !== this._origin.x || this.origin.y !== this._origin.y) {
                    this._halfSize.x = this.parent.width / 2;
                    this._halfSize.y = this.parent.height / 2;
                    this._offset.x = this.origin.x * this.parent.width;
                    this._offset.y = this.origin.y * this.parent.height;
                    this._angle = Math.atan2(this.halfHeight - this._offset.y, this.halfWidth - this._offset.x);
                    this._distance = Math.sqrt(((this._offset.x - this._halfSize.x) * (this._offset.x - this._halfSize.x)) + ((this._offset.y - this._halfSize.y) * (this._offset.y - this._halfSize.y)));

                    //  Store
                    this._size.x = this.parent.width;
                    this._size.y = this.parent.height;
                    this._origin.x = this.origin.x;
                    this._origin.y = this.origin.y;
                    this._dirty = true;
                }

                if (this.rotation != this._prevRotation) {
                    this._sc.x = Math.sin((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
                    this._sc.y = Math.cos((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
                    this._scA.y = Math.cos((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD + this._angle);
                    this._scA.x = Math.sin((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD + this._angle);

                    if (this.parent.texture.renderRotation) {
                        this._sc.x = Math.sin((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
                        this._sc.y = Math.cos((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
                    } else {
                        this._sc.x = 0;
                        this._sc.y = 1;
                    }

                    //  Store
                    this._prevRotation = this.rotation;
                    this._dirty = true;
                }

                if (this._dirty || this.parent.x != this._pos.x || this.parent.y != this._pos.y) {
                    this.center.x = this.parent.x + this._distance * this._scA.y;
                    this.center.y = this.parent.y + this._distance * this._scA.x;

                    this.upperLeft.setTo(this.center.x - this._halfSize.x * this._sc.y + this._halfSize.y * this._sc.x, this.center.y - this._halfSize.y * this._sc.y - this._halfSize.x * this._sc.x);
                    this.upperRight.setTo(this.center.x + this._halfSize.x * this._sc.y + this._halfSize.y * this._sc.x, this.center.y - this._halfSize.y * this._sc.y + this._halfSize.x * this._sc.x);
                    this.bottomLeft.setTo(this.center.x - this._halfSize.x * this._sc.y - this._halfSize.y * this._sc.x, this.center.y + this._halfSize.y * this._sc.y - this._halfSize.x * this._sc.x);
                    this.bottomRight.setTo(this.center.x + this._halfSize.x * this._sc.y - this._halfSize.y * this._sc.x, this.center.y + this._halfSize.y * this._sc.y + this._halfSize.x * this._sc.x);

                    this._pos.x = this.parent.x;
                    this._pos.y = this.parent.y;
                }

                if (this.parent.texture.flippedX) {
                    this.local.data[0] = this._sc.y * -this.scale.x;
                    this.local.data[3] = (this._sc.x * -this.scale.x) + this.skew.x;
                } else {
                    this.local.data[0] = this._sc.y * this.scale.x;
                    this.local.data[3] = (this._sc.x * this.scale.x) + this.skew.x;
                }

                if (this.parent.texture.flippedY) {
                    this.local.data[4] = this._sc.y * -this.scale.y;
                    this.local.data[1] = -(this._sc.x * -this.scale.y) + this.skew.y;
                } else {
                    this.local.data[4] = this._sc.y * this.scale.y;
                    this.local.data[1] = -(this._sc.x * this.scale.y) + this.skew.y;
                }

                //  Translate
                this.local.data[2] = this.parent.x;
                this.local.data[5] = this.parent.y;
            };
            return TransformManager;
        })();
        Components.TransformManager = TransformManager;
    })(Phaser.Components || (Phaser.Components = {}));
    var Components = Phaser.Components;
})(Phaser || (Phaser = {}));
