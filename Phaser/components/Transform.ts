/// <reference path="../Game.ts" />
/// <reference path="../math/Mat3.ts" />

/**
* Phaser - Components - Transform
*/

module Phaser.Components {

    export class Transform {

        /**
         * Creates a new Sprite Transform component
         * @param parent The Sprite using this transform
         */
        constructor(parent) {

            this.game = parent.game;
            this.parent = parent;

            this.local = new Mat3;

            this.scrollFactor = new Phaser.Vec2(1, 1);
            this.origin = new Phaser.Vec2;
            this.scale = new Phaser.Vec2(1, 1);
            this.skew = new Phaser.Vec2;

        }

        private _rotation: number;

        private _cachedSin: number;
        private _cachedCos: number;
        private _cachedRotation: number;
        private _cachedScaleX: number;
        private _cachedScaleY: number;
        private _cachedAngle: number;
        private _cachedAngleToCenter: number;
        private _cachedDistance: number;
        private _cachedWidth: number;
        private _cachedHeight: number;
        private _cachedHalfWidth: number;
        private _cachedHalfHeight: number;
        private _cachedCosAngle: number;
        private _cachedSinAngle: number;
        private _cachedOffsetX: number;
        private _cachedOffsetY: number;
        private _cachedOriginX: number;
        private _cachedOriginY: number;
        private _cachedCenterX: number;
        private _cachedCenterY: number;

        public local: Mat3;

        public setCache() {

            this._cachedHalfWidth = this.parent.width / 2;
            this._cachedHalfHeight = this.parent.height / 2;
            this._cachedOffsetX = this.origin.x * this.parent.width;
            this._cachedOffsetY = this.origin.y * this.parent.height;
            this._cachedAngleToCenter = Math.atan2(this.halfHeight - this._cachedOffsetY, this.halfWidth - this._cachedOffsetX);
            this._cachedDistance = Math.sqrt(((this._cachedOffsetX - this._cachedHalfWidth) * (this._cachedOffsetX - this._cachedHalfWidth)) + ((this._cachedOffsetY - this._cachedHalfHeight) * (this._cachedOffsetY - this._cachedHalfHeight)));
            this._cachedWidth = this.parent.width;
            this._cachedHeight = this.parent.height;
            this._cachedOriginX = this.origin.x;
            this._cachedOriginY = this.origin.y;
            this._cachedSin = Math.sin((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD);
            this._cachedCos = Math.cos((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD);
            this._cachedCosAngle = Math.cos((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD + this._cachedAngleToCenter);
            this._cachedSinAngle = Math.sin((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD + this._cachedAngleToCenter);
            this._cachedRotation = this.rotation;

            if (this.parent.texture && this.parent.texture.renderRotation)
            {
                this._cachedSin = Math.sin((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD);
                this._cachedCos = Math.cos((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD);
            }
            else
            {
                this._cachedSin = 0;
                this._cachedCos = 1;
            }

        }

        public update() {

            //  Check cache
            var dirty: bool = false;

            //  1) Height or Width change (also triggered by a change in scale) or an Origin change
            if (this.parent.width !== this._cachedWidth || this.parent.height !== this._cachedHeight || this.origin.x !== this._cachedOriginX|| this.origin.y !== this._cachedOriginY)
            {
                this._cachedHalfWidth = this.parent.width / 2;
                this._cachedHalfHeight = this.parent.height / 2;
                this._cachedOffsetX = this.origin.x * this.parent.width;
                this._cachedOffsetY = this.origin.y * this.parent.height;
                this._cachedAngleToCenter = Math.atan2(this.halfHeight - this._cachedOffsetY, this.halfWidth - this._cachedOffsetX);
                this._cachedDistance = Math.sqrt(((this._cachedOffsetX - this._cachedHalfWidth) * (this._cachedOffsetX - this._cachedHalfWidth)) + ((this._cachedOffsetY - this._cachedHalfHeight) * (this._cachedOffsetY - this._cachedHalfHeight)));
                //  Store
                this._cachedWidth = this.parent.width;
                this._cachedHeight = this.parent.height;
                this._cachedOriginX = this.origin.x;
                this._cachedOriginY = this.origin.y;
                dirty = true;
            }

            //  2) Rotation change
            if (this.rotation != this._cachedRotation)
            {
                this._cachedSin = Math.sin((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD);
                this._cachedCos = Math.cos((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD);
                this._cachedCosAngle = Math.cos((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD + this._cachedAngleToCenter);
                this._cachedSinAngle = Math.sin((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD + this._cachedAngleToCenter);

                if (this.parent.texture.renderRotation)
                {
                    this._cachedSin = Math.sin((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD);
                    this._cachedCos = Math.cos((this.rotation + this.rotationOffset) * GameMath.DEG_TO_RAD);
                }
                else
                {
                    this._cachedSin = 0;
                    this._cachedCos = 1;
                }

                //  Store
                this._cachedRotation = this.rotation;
                dirty = true;
            }

            if (dirty)
            {
                this._cachedCenterX = this.parent.x + this._cachedDistance * this._cachedCosAngle;
                this._cachedCenterY = this.parent.y + this._cachedDistance * this._cachedSinAngle;
            }

            //  Scale and Skew
            if (this.parent.texture.flippedX)
            {
                this.local.data[0] = this._cachedCos * -this.scale.x;
                this.local.data[3] = (this._cachedSin * -this.scale.x) + this.skew.x;
            }
            else
            {
                this.local.data[0] = this._cachedCos * this.scale.x;
                this.local.data[3] = (this._cachedSin * this.scale.x) + this.skew.x;
            }

            if (this.parent.texture.flippedY)
            {
                this.local.data[4] = this._cachedCos * -this.scale.y;
                this.local.data[1] = -(this._cachedSin * -this.scale.y) + this.skew.y;
            }
            else
            {
                this.local.data[4] = this._cachedCos * this.scale.y;
                this.local.data[1] = -(this._cachedSin * this.scale.y) + this.skew.y;
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
        public scale: Phaser.Vec2;

        /**
         * Skew the object along the x and y axis. A skew value of 0 is no skew.
         */
        public skew: Phaser.Vec2;

        /**
         * The influence of camera movement upon the object, if supported.
         */
        public scrollFactor: Phaser.Vec2;

        /**
         * The origin is the point around which scale and rotation takes place and defaults to the top-left of the sprite.
         */
        public origin: Phaser.Vec2;

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
            return this._cachedDistance;
            //return Math.sqrt(((this.offsetX - this.halfWidth) * (this.offsetX - this.halfWidth)) + ((this.offsetY - this.halfHeight) * (this.offsetY - this.halfHeight)));
        }

        /**
        * The angle between the center of the transform to the rotation origin.
        */
        public get angleToCenter(): number {
            return this._cachedAngleToCenter;
            //return Math.atan2(this.halfHeight - this.offsetY, this.halfWidth - this.offsetX);
        }

        /**
        * The offset on the X axis of the origin
        */
        public get offsetX(): number {
            return this._cachedOffsetX;
            //return this.origin.x * this.parent.width;
        }

        /**
        * The offset on the Y axis of the origin
        */
        public get offsetY(): number {
            return this._cachedOffsetY;
            //return this.origin.y * this.parent.height;
        }

        /**
        * Half the width of the parent sprite, taking into consideration scaling
        */
        public get halfWidth(): number {
            return this._cachedHalfWidth;
            //return this.parent.width / 2;
        }

        /**
        * Half the height of the parent sprite, taking into consideration scaling
        */
        public get halfHeight(): number {
            return this._cachedHalfHeight;
            //return this.parent.height / 2;
        }

        /**
         * The center of the Sprite in world coordinates, after taking scaling and rotation into consideration
         */
        public get centerX(): number {
            return this._cachedCenterX;
            //return this.parent.x + this.distance * Math.cos((this.rotation * Math.PI / 180) + this.angleToCenter);
        }

        /**
         * The center of the Sprite in world coordinates, after taking scaling and rotation into consideration
         */
        public get centerY(): number {
            return this._cachedCenterY;
            //return this.parent.y + this.distance * Math.sin((this.rotation * Math.PI / 180) + this.angleToCenter);
        }

        public get sin(): number {
            return this._cachedSin;
        }

        public get cos(): number {
            return this._cachedCos;
        }

    }

}