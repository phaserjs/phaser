/// <reference path="../../core/Vec2.ts" />

/**
* Phaser - Components - Position
*
* Sprite position, both world and screen, and rotation values and methods.
*/

module Phaser.Components {

    export class Position {

        constructor(parent: Sprite, x: number, y: number) {

            this._sprite = parent;

            this.world = new Phaser.Vec2(x, y);
            this.screen = new Phaser.Vec2(x, y);

            this.offset = new Phaser.Vec2(0, 0);
            this.midpoint = new Phaser.Vec2(0, 0);

        }

        /**
         * Reference to the Image stored in the Game.Cache that is used as the texture for the Sprite.
         */
        private _sprite: Sprite;

        public world: Phaser.Vec2;
        public screen: Phaser.Vec2;

        public offset: Phaser.Vec2;
        public midpoint: Phaser.Vec2;

        /**
         * Rotation angle of this object.
         * @type {number}
         */
        private _rotation: number = 0;

        /**
         * Z-order value of the object.
         */
        public z: number = 0;

        /**
         * This value is added to the rotation of the Sprite.
         * For example if you had a sprite graphic drawn facing straight up then you could set
         * rotationOffset to 90 and it would correspond correctly with Phasers right-handed coordinate system.
         * @type {number}
         */
        public rotationOffset: number = 0;

        public get rotation(): number {
            return this._rotation;
        }

        public set rotation(value: number) {
            this._rotation = this._sprite.game.math.wrap(value, 360, 0);
        }

    }

}