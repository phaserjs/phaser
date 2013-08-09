/// <reference path="../../_definitions.ts" />

/**
* Phaser - ArcadePhysics - Body
*/

module Phaser.Physics {

    export class Body {

        constructor(sprite: Phaser.Sprite, type: number) {

            this.sprite = sprite;
            this.game = sprite.game;
            this.type = type;

            //  Fixture properties
            //  Will extend into its own class at a later date - can move the fixture defs there and add shape support, but this will do for 1.0 release
            this.bounds = new Phaser.Rectangle;

            this._width = sprite.width;
            this._height = sprite.height;


            //  Body properties
            //this.gravity = Vec2Utils.clone(ArcadePhysics.gravity);
            //this.bounce = Vec2Utils.clone(ArcadePhysics.bounce);

            this.velocity = new Phaser.Vec2;
            this.acceleration = new Phaser.Vec2;
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
            this.offset = new Phaser.Vec2;

        }

        /**
         * Reference to Phaser.Game
         */
        public game: Phaser.Game;

        /**
         * Reference to the parent Sprite
         */
        public sprite: Phaser.Sprite;

        /**
         * The type of Body (disabled, dynamic, static or kinematic)
         * Disabled = skips all physics operations / tests (default)
         * Dynamic = gives and receives impacts
         * Static = gives but doesn't receive impacts, cannot be moved by physics
         * Kinematic = gives impacts, but never receives, can be moved by physics
         * @type {number}
         */
        public type: number;

        public gravity: Phaser.Vec2;
        public bounce: Phaser.Vec2;

        public velocity: Phaser.Vec2;
        public acceleration: Phaser.Vec2;
        public drag: Phaser.Vec2;
        public maxVelocity: Phaser.Vec2;

        public angularVelocity: number = 0;
        public angularAcceleration: number = 0;
        public angularDrag: number = 0;
        public maxAngular: number = 10000;

        /**
         * Orientation of the object.
         * @type {number}
         */
        public facing: number;

        public touching: number;
        public allowCollisions: number;
        public wasTouching: number;
        public mass: number = 1;

        public position: Phaser.Vec2;
        public oldPosition: Phaser.Vec2;
        public offset: Phaser.Vec2;
        public bounds: Phaser.Rectangle;

        private _width: number = 0;
        private _height: number = 0;

        public get x(): number {
            return this.sprite.x + this.offset.x;
        }

        public get y(): number {
            return this.sprite.y + this.offset.y;
        }

        public set width(value: number) {
            this._width = value;
        }

        public set height(value: number) {
            this._height = value;
        }

        public get width(): number {
            return this._width * this.sprite.transform.scale.x;
        }

        public get height(): number {
            return this._height * this.sprite.transform.scale.y;
        }

        public preUpdate() {

            this.oldPosition.copyFrom(this.position);

            this.bounds.x = this.x;
            this.bounds.y = this.y;
            this.bounds.width = this.width;
            this.bounds.height = this.height;

        }

        //  Shall we do this? Or just update the values directly in the separate functions? But then the bounds will be out of sync - as long as
        //  the bounds are updated and used in calculations then we can do one final sprite movement here I guess?
        public postUpdate() {

            //  if this is all it does maybe move elsewhere? Sprite postUpdate?
            if (this.type !== Phaser.Types.BODY_DISABLED)
            {
                //this.game.world.physics.updateMotion(this);

                this.wasTouching = this.touching;
                this.touching = Phaser.Types.NONE;

            }

            this.position.setTo(this.x, this.y);

        }

        public get hullWidth(): number {

            if (this.deltaX > 0)
            {
                return this.bounds.width + this.deltaX;
            }
            else
            {
                return this.bounds.width - this.deltaX;
            }

        }

        public get hullHeight(): number {

            if (this.deltaY > 0)
            {
                return this.bounds.height + this.deltaY;
            }
            else
            {
                return this.bounds.height - this.deltaY;
            }

        }

        public get hullX(): number {

            if (this.position.x < this.oldPosition.x)
            {
                return this.position.x;
            }
            else
            {
                return this.oldPosition.x;
            }

        }

        public get hullY(): number {

            if (this.position.y < this.oldPosition.y)
            {
                return this.position.y;
            }
            else
            {
                return this.oldPosition.y;
            }

        }

        public get deltaXAbs(): number {
            return (this.deltaX > 0 ? this.deltaX : -this.deltaX);
        }

        public get deltaYAbs(): number {
            return (this.deltaY > 0 ? this.deltaY : -this.deltaY);
        }

        public get deltaX(): number {
            return this.position.x - this.oldPosition.x;
        }

        public get deltaY(): number {
            return this.position.y - this.oldPosition.y;
        }

    }

}