/// <reference path="../Game.ts" />
/// <reference path="../math/Mat3.ts" />
/// <reference path="../geom/Point.ts" />

/**
* Phaser - Components - Transform
*/

module Phaser.Components {

    export class Transform {

        /**
         * Creates a new Transform component
         * @param parent The game object using this transform
         */
        constructor(parent) {

            this.game = parent.game;
            this.parent = parent;

            this.local = new Mat3;

            this.scrollFactor = new Phaser.Vec2(1, 1);
            this.origin = new Phaser.Vec2;
            this.scale = new Phaser.Vec2(1, 1);
            this.skew = new Phaser.Vec2;

            this.center = new Phaser.Point;
            this.upperLeft = new Phaser.Point;
            this.upperRight = new Phaser.Point;
            this.bottomLeft = new Phaser.Point;
            this.bottomRight = new Phaser.Point;

            this._pos = new Phaser.Point;
            this._scale = new Phaser.Point;
            this._size = new Phaser.Point;
            this._halfSize = new Phaser.Point;
            this._offset = new Phaser.Point;
            this._origin = new Phaser.Point;
            this._sc = new Phaser.Point;
            this._scA = new Phaser.Point;

        }

        private _rotation: number;

        //  Cache vars
        private _pos: Phaser.Point;
        private _scale: Phaser.Point;
        private _size: Phaser.Point;
        private _halfSize: Phaser.Point;
        private _offset: Phaser.Point;
        private _origin: Phaser.Point;
        private _sc: Phaser.Point;
        private _scA: Phaser.Point;
        private _angle: number;
        private _distance: number;
        private _prevRotation: number;

        /**
         * The center of the Sprite in world coordinates, after taking scaling and rotation into consideration
         */
        public center: Phaser.Point;

        /**
         * The upper-left corner of the Sprite in world coordinates, after taking scaling and rotation into consideration
         */
        public upperLeft: Phaser.Point;

        /**
         * The upper-right corner of the Sprite in world coordinates, after taking scaling and rotation into consideration
         */
        public upperRight: Phaser.Point;

        /**
         * The bottom-left corner of the Sprite in world coordinates, after taking scaling and rotation into consideration
         */
        public bottomLeft: Phaser.Point;

        /**
         * The bottom-right corner of the Sprite in world coordinates, after taking scaling and rotation into consideration
         */
        public bottomRight: Phaser.Point;

        /**
         * The local transform matrix
         */
        public local: Mat3;

        /**
         * Populates the transform cache. Called by the parent object on creation.
         */
        public setCache() {

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
            this._sc.x = Math.sin((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD);
            this._sc.y = Math.cos((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD);
            this._scA.y = Math.cos((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD + this._angle);
            this._scA.x = Math.sin((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD + this._angle);
            this._prevRotation = this.rotation;

            if (this.parent.texture && this.parent.texture.renderRotation)
            {
                this._sc.x = Math.sin((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD);
                this._sc.y = Math.cos((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD);
            }
            else
            {
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

        }

        /**
         * Updates the local transform matrix and the cache values if anything has changed in the parent.
         */
        public update() {

            //  Check cache
            var dirty: bool = false;

            //  1) Height or Width change (also triggered by a change in scale) or an Origin change
            if (this.parent.width !== this._size.x || this.parent.height !== this._size.y || this.origin.x !== this._origin.x|| this.origin.y !== this._origin.y)
            {
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
                dirty = true;
            }

            //  2) Rotation change
            if (this.rotation != this._prevRotation)
            {
                this._sc.x = Math.sin((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD);
                this._sc.y = Math.cos((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD);
                this._scA.y = Math.cos((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD + this._angle);
                this._scA.x = Math.sin((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD + this._angle);

                if (this.parent.texture.renderRotation)
                {
                    this._sc.x = Math.sin((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD);
                    this._sc.y = Math.cos((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD);
                }
                else
                {
                    this._sc.x = 0;
                    this._sc.y = 1;
                }

                //  Store
                this._prevRotation = this.rotation;
                dirty = true;
            }

            //  If it has moved, update the edges and center
            if (dirty || this.parent.x != this._pos.x || this.parent.y != this._pos.y)
            {
                this.center.x = this.parent.x + this._distance * this._scA.y;
                this.center.y = this.parent.y + this._distance * this._scA.x;

                this.upperLeft.setTo(this.center.x - this._halfSize.x * this._sc.y + this._halfSize.y * this._sc.x, this.center.y - this._halfSize.y * this._sc.y - this._halfSize.x * this._sc.x);
                this.upperRight.setTo(this.center.x + this._halfSize.x * this._sc.y + this._halfSize.y * this._sc.x, this.center.y - this._halfSize.y * this._sc.y + this._halfSize.x * this._sc.x);
                this.bottomLeft.setTo(this.center.x - this._halfSize.x * this._sc.y - this._halfSize.y * this._sc.x, this.center.y + this._halfSize.y * this._sc.y - this._halfSize.x * this._sc.x);
                this.bottomRight.setTo(this.center.x + this._halfSize.x * this._sc.y - this._halfSize.y * this._sc.x, this.center.y + this._halfSize.y * this._sc.y + this._halfSize.x * this._sc.x);

                this._pos.x = this.parent.x;
                this._pos.y = this.parent.y;
            }

            //  Scale and Skew
            if (this.parent.texture.flippedX)
            {
                this.local.data[0] = this._sc.y * -this.scale.x;
                this.local.data[3] = (this._sc.x * -this.scale.x) + this.skew.x;
            }
            else
            {
                this.local.data[0] = this._sc.y * this.scale.x;
                this.local.data[3] = (this._sc.x * this.scale.x) + this.skew.x;
            }

            if (this.parent.texture.flippedY)
            {
                this.local.data[4] = this._sc.y * -this.scale.y;
                this.local.data[1] = -(this._sc.x * -this.scale.y) + this.skew.y;
            }
            else
            {
                this.local.data[4] = this._sc.y * this.scale.y;
                this.local.data[1] = -(this._sc.x * this.scale.y) + this.skew.y;
            }

            //  Translate
            this.local.data[2] = this.parent.x;
            this.local.data[5] = this.parent.y;

        }

        /**
         * Reference to Phaser.Game
         */
        public game: Game;

        /**
         * Reference to the parent object (Sprite, Group, etc)
         */
        public parent: Phaser.Sprite;

        /**
         * Scale of the object. A scale of 1.0 is the original size. 0.5 half size. 2.0 double sized.
         */
        public scale: Vec2;

        /**
         * Skew the object along the x and y axis. A skew value of 0 is no skew.
         */
        public skew: Vec2;

        /**
         * The influence of camera movement upon the object, if supported.
         */
        public scrollFactor: Vec2;

        /**
         * The origin is the point around which scale and rotation takes place and defaults to the top-left of the sprite.
         */
        public origin: Vec2;

        /**
         * This value is added to the rotation of the object.
         * For example if you had a texture drawn facing straight up then you could set
         * rotationOffset to 90 and it would correspond correctly with Phasers right-handed coordinate system.
         * @type {number}
         */
        public rotationOffset: number = 0;

        /**
        * The rotation of the object in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
        */
        public rotation: number = 0;

        /**
        * The distance from the center of the transform to the rotation origin.
        */
        public get distance(): number {
            return this._distance;
        }

        /**
        * The angle between the center of the transform to the rotation origin.
        */
        public get angleToCenter(): number {
            return this._angle;
        }

        /**
        * The offset on the X axis of the origin
        */
        public get offsetX(): number {
            return this._offset.x;
        }

        /**
        * The offset on the Y axis of the origin
        */
        public get offsetY(): number {
            return this._offset.y;
        }

        /**
        * Half the width of the parent sprite, taking into consideration scaling
        */
        public get halfWidth(): number {
            return this._halfSize.x;
        }

        /**
        * Half the height of the parent sprite, taking into consideration scaling
        */
        public get halfHeight(): number {
            return this._halfSize.y;
        }

        /**
         * The equivalent of Math.sin(rotation + rotationOffset)
         */
        public get sin(): number {
            return this._sc.x;
        }

        /**
         * The equivalent of Math.cos(rotation + rotationOffset)
         */
        public get cos(): number {
            return this._sc.y;
        }

    }

}