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

        private _sin: number;
        private _cos: number;

        public local: Mat3;

        public update() {

            //  Scale & Skew

            this._sin = 0;
            this._cos = 1;

            if (this.parent.texture.renderRotation)
            {
                this._sin = GameMath.sinA[this.rotation + this.rotationOffset];
                this._cos = GameMath.cosA[this.rotation + this.rotationOffset];
            }

            if (this.parent.texture.flippedX)
            {
                this.local.data[0] = this._cos * -this.scale.x;
                this.local.data[3] = (this._sin * -this.scale.x) + this.skew.x;
            }
            else
            {
                this.local.data[0] = this._cos * this.scale.x;
                this.local.data[3] = (this._sin * this.scale.x) + this.skew.x;
            }

            if (this.parent.texture.flippedY)
            {
                this.local.data[4] = this._cos * -this.scale.y;
                this.local.data[1] = -(this._sin * -this.scale.y) + this.skew.y;
            }
            else
            {
                this.local.data[4] = this._cos * this.scale.y;
                this.local.data[1] = -(this._sin * this.scale.y) + this.skew.y;
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
         * The origin is the point around which scale and rotation takes place and defaults to the center of the sprite.
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
         * The center of the Sprite after taking scaling into consideration
         */
        public get centerX(): number {
            return this.parent.width / 2;
        }

        /**
         * The center of the Sprite after taking scaling into consideration
         */
        public get centerY(): number {
            return this.parent.height / 2;
        }

    }

}