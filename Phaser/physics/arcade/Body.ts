/// <reference path="../../math/Vec2.ts" />
/// <reference path="../../geom/Point.ts" />
/// <reference path="../../math/Vec2Utils.ts" />
/// <reference path="ArcadePhysics.ts" />

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
            this.bounds = new Rectangle;

            this._width = sprite.width;
            this._height = sprite.height;


            //  Body properties
            //this.gravity = Vec2Utils.clone(ArcadePhysics.gravity);
            //this.bounce = Vec2Utils.clone(ArcadePhysics.bounce);

            this.velocity = new Vec2;
            this.acceleration = new Vec2;
            //this.drag = Vec2Utils.clone(ArcadePhysics.drag);
            this.maxVelocity = new Vec2(10000, 10000);

            this.angularVelocity = 0;
            this.angularAcceleration = 0;
            this.angularDrag = 0;

            this.touching = Types.NONE;
            this.wasTouching = Types.NONE;
            this.allowCollisions = Types.ANY;

            this.position = new Vec2(sprite.x + this.bounds.halfWidth, sprite.y + this.bounds.halfHeight);
            this.oldPosition = new Vec2(sprite.x + this.bounds.halfWidth, sprite.y + this.bounds.halfHeight);
            this.offset = new Vec2;

        }

        /**
         * Reference to Phaser.Game
         */
        public game: Game;

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

        public gravity: Vec2;
        public bounce: Vec2;

        public velocity: Vec2;
        public acceleration: Vec2;
        public drag: Vec2;
        public maxVelocity: Vec2;

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

        public position: Vec2;
        public oldPosition: Vec2;
        public offset: Vec2;
        public bounds: Rectangle;



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










        //  MOVE THESE TO A UTIL

        public render(context:CanvasRenderingContext2D) {

            context.beginPath();
            context.strokeStyle = 'rgb(0,255,0)';
            context.strokeRect(this.position.x - this.bounds.halfWidth, this.position.y - this.bounds.halfHeight, this.bounds.width, this.bounds.height);
            context.stroke();
            context.closePath();

            //  center point
            context.fillStyle = 'rgb(0,255,0)';
            context.fillRect(this.position.x, this.position.y, 2, 2);

            if (this.touching & Phaser.Types.LEFT)
            {
                context.beginPath();
                context.strokeStyle = 'rgb(255,0,0)';
                context.moveTo(this.position.x - this.bounds.halfWidth, this.position.y - this.bounds.halfHeight);
                context.lineTo(this.position.x - this.bounds.halfWidth, this.position.y + this.bounds.halfHeight);
                context.stroke();
                context.closePath();
            }
            if (this.touching & Phaser.Types.RIGHT)
            {
                context.beginPath();
                context.strokeStyle = 'rgb(255,0,0)';
                context.moveTo(this.position.x + this.bounds.halfWidth, this.position.y - this.bounds.halfHeight);
                context.lineTo(this.position.x + this.bounds.halfWidth, this.position.y + this.bounds.halfHeight);
                context.stroke();
                context.closePath();
            }

            if (this.touching & Phaser.Types.UP)
            {
                context.beginPath();
                context.strokeStyle = 'rgb(255,0,0)';
                context.moveTo(this.position.x - this.bounds.halfWidth, this.position.y - this.bounds.halfHeight);
                context.lineTo(this.position.x + this.bounds.halfWidth, this.position.y - this.bounds.halfHeight);
                context.stroke();
                context.closePath();
            }
            if (this.touching & Phaser.Types.DOWN)
            {
                context.beginPath();
                context.strokeStyle = 'rgb(255,0,0)';
                context.moveTo(this.position.x - this.bounds.halfWidth, this.position.y + this.bounds.halfHeight);
                context.lineTo(this.position.x + this.bounds.halfWidth, this.position.y + this.bounds.halfHeight);
                context.stroke();
                context.closePath();
            }

        }


        /**
         * Render debug infos. (including name, bounds info, position and some other properties)
         * @param x {number} X position of the debug info to be rendered.
         * @param y {number} Y position of the debug info to be rendered.
         * @param [color] {number} color of the debug info to be rendered. (format is css color string)
         */
        public renderDebugInfo(x: number, y: number, color?: string = 'rgb(255,255,255)') {

            this.sprite.texture.context.fillStyle = color;
            this.sprite.texture.context.fillText('Sprite: (' + this.sprite.width + ' x ' + this.sprite.height + ')', x, y);
            //this.sprite.texture.context.fillText('x: ' + this._sprite.frameBounds.x.toFixed(1) + ' y: ' + this._sprite.frameBounds.y.toFixed(1) + ' rotation: ' + this._sprite.rotation.toFixed(1), x, y + 14);
            this.sprite.texture.context.fillText('x: ' + this.bounds.x.toFixed(1) + ' y: ' + this.bounds.y.toFixed(1) + ' rotation: ' + this.sprite.transform.rotation.toFixed(0), x, y + 14);
            this.sprite.texture.context.fillText('vx: ' + this.velocity.x.toFixed(1) + ' vy: ' + this.velocity.y.toFixed(1), x, y + 28);
            this.sprite.texture.context.fillText('acx: ' + this.acceleration.x.toFixed(1) + ' acy: ' + this.acceleration.y.toFixed(1), x, y + 42);
            this.sprite.texture.context.fillText('angVx: ' + this.angularVelocity.toFixed(1) + ' angAc: ' + this.angularAcceleration.toFixed(1), x, y + 56);

        }


    }

}