/// <reference path="../Game.ts" />
/// <reference path="../core/Rectangle.ts" />
/// <reference path="../math/Vec2Utils.ts" />
/// <reference path="PhysicsManager.ts" />
/// <reference path="IPhysicsShape.ts" />

/**
* Phaser - Physics - AABB
*/

module Phaser.Physics {

    export class AABB implements IPhysicsShape {

        constructor(game: Game, sprite: Sprite, x: number, y: number, width: number, height: number) {

            this.game = game;
            this.world = game.world.physics;

            if (sprite !== null)
            {
                this.sprite = sprite;
                this.scale = Vec2Utils.clone(this.sprite.scale);
            }
            else
            {
                this.sprite = null;
                this.physics = null;
                this.scale = new Vec2(1, 1);
            }

            this.bounds = new Rectangle(x + Math.round(width / 2), y + Math.round(height / 2), width, height);
            this.position = new Vec2(x + this.bounds.halfWidth, y + this.bounds.halfHeight);
            this.oldPosition = new Vec2(x + this.bounds.halfWidth, y + this.bounds.halfHeight);
            this.offset = new Vec2(0, 0);

        }

        public game: Game;
        public world: PhysicsManager;
        public sprite: Sprite;
        public physics: Phaser.Components.Physics;

        public position: Vec2;
        public oldPosition: Vec2;
        public offset: Vec2;
        public scale: Vec2;
        public bounds: Rectangle;

        public preUpdate() {

            this.oldPosition.copyFrom(this.position);

            this.bounds.x = this.position.x - this.bounds.halfWidth;
            this.bounds.y = this.position.y - this.bounds.halfHeight;
            
            if (this.sprite)
            {
                this.position.setTo((this.sprite.x + this.bounds.halfWidth) + this.offset.x, (this.sprite.y + this.bounds.halfHeight) + this.offset.y);
    
                //  Update scale / dimensions
                if (Vec2Utils.equals(this.scale, this.sprite.scale) == false)
                {
                    this.scale.copyFrom(this.sprite.scale);
                    this.bounds.width = this.sprite.width;
                    this.bounds.height = this.sprite.height;
                }
            }

        }

        public update() {

            //this.bounds.x = this.position.x;
            //this.bounds.y = this.position.y;

        }

        public setSize(width: number, height: number) {

            this.bounds.width = width;
            this.bounds.height = height;

        }

        public render(context:CanvasRenderingContext2D) {

            context.beginPath();
            context.strokeStyle = 'rgb(0,255,0)';
            context.strokeRect(this.position.x - this.bounds.halfWidth, this.position.y - this.bounds.halfHeight, this.bounds.width, this.bounds.height);
            context.stroke();
            context.closePath();

            //  center point
            context.fillStyle = 'rgb(0,255,0)';
            context.fillRect(this.position.x, this.position.y, 2, 2);

            if (this.physics.touching & Phaser.Types.LEFT)
            {
                context.beginPath();
                context.strokeStyle = 'rgb(255,0,0)';
                context.moveTo(this.position.x - this.bounds.halfWidth, this.position.y - this.bounds.halfHeight);
                context.lineTo(this.position.x - this.bounds.halfWidth, this.position.y + this.bounds.halfHeight);
                context.stroke();
                context.closePath();
            }
            if (this.physics.touching & Phaser.Types.RIGHT)
            {
                context.beginPath();
                context.strokeStyle = 'rgb(255,0,0)';
                context.moveTo(this.position.x + this.bounds.halfWidth, this.position.y - this.bounds.halfHeight);
                context.lineTo(this.position.x + this.bounds.halfWidth, this.position.y + this.bounds.halfHeight);
                context.stroke();
                context.closePath();
            }

            if (this.physics.touching & Phaser.Types.UP)
            {
                context.beginPath();
                context.strokeStyle = 'rgb(255,0,0)';
                context.moveTo(this.position.x - this.bounds.halfWidth, this.position.y - this.bounds.halfHeight);
                context.lineTo(this.position.x + this.bounds.halfWidth, this.position.y - this.bounds.halfHeight);
                context.stroke();
                context.closePath();
            }
            if (this.physics.touching & Phaser.Types.DOWN)
            {
                context.beginPath();
                context.strokeStyle = 'rgb(255,0,0)';
                context.moveTo(this.position.x - this.bounds.halfWidth, this.position.y + this.bounds.halfHeight);
                context.lineTo(this.position.x + this.bounds.halfWidth, this.position.y + this.bounds.halfHeight);
                context.stroke();
                context.closePath();
            }

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