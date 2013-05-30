/// <reference path="../Game.ts" />
/// <reference path="../core/Rectangle.ts" />
/// <reference path="../math/Vec2Utils.ts" />
/// <reference path="PhysicsManager.ts" />
/// <reference path="IPhysicsShape.ts" />

/**
* Phaser - Physics - Circle
*/

module Phaser.Physics {

    export class Circle implements IPhysicsShape {

        constructor(game: Game, sprite: Sprite, x: number, y: number, diameter: number) {

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

            this.radius = diameter / 2;
            this.bounds = new Rectangle(x + Math.round(diameter / 2), y + Math.round(diameter / 2), diameter, diameter);
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

        public radius: number;
        public oH: number;
        public oV: number;

        public preUpdate() {

            this.oldPosition.copyFrom(this.position);
            
            if (this.sprite)
            {
                this.position.setTo((this.sprite.x + this.bounds.halfWidth) + this.offset.x, (this.sprite.y + this.bounds.halfHeight) + this.offset.y);
    
                //  Update scale / dimensions
                if (Vec2Utils.equals(this.scale, this.sprite.scale) == false)
                {
                    this.scale.copyFrom(this.sprite.scale);
                    //  needs to be radius based (+ square)
                    //this.bounds.width = this.sprite.width;
                    //this.bounds.height = this.sprite.height;
                }
            }

        }

        public update() {

            this.bounds.x = this.position.x;
            this.bounds.y = this.position.y;

        }

        public setSize(width: number, height: number) {

            this.bounds.width = width;
            this.bounds.height = height;

        }

        public render(context:CanvasRenderingContext2D) {

            context.beginPath();
            context.strokeStyle = 'rgb(0,255,0)';
            context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
            context.stroke();
            context.closePath();

            //  center point
            context.fillStyle = 'rgb(0,255,0)';
            context.fillRect(this.position.x, this.position.y, 2, 2);

            if (this.oH == 1)
            {
                context.beginPath();
                context.strokeStyle = 'rgb(255,0,0)';
                context.moveTo(this.position.x - this.bounds.halfWidth, this.position.y - this.bounds.halfHeight);
                context.lineTo(this.position.x - this.bounds.halfWidth, this.position.y + this.bounds.halfHeight);
                context.stroke();
                context.closePath();
            }
            else if (this.oH == -1)
            {
                context.beginPath();
                context.strokeStyle = 'rgb(255,0,0)';
                context.moveTo(this.position.x + this.bounds.halfWidth, this.position.y - this.bounds.halfHeight);
                context.lineTo(this.position.x + this.bounds.halfWidth, this.position.y + this.bounds.halfHeight);
                context.stroke();
                context.closePath();
            }

            if (this.oV == 1)
            {
                context.beginPath();
                context.strokeStyle = 'rgb(255,0,0)';
                context.moveTo(this.position.x - this.bounds.halfWidth, this.position.y - this.bounds.halfHeight);
                context.lineTo(this.position.x + this.bounds.halfWidth, this.position.y - this.bounds.halfHeight);
                context.stroke();
                context.closePath();
            }
            else if (this.oV == -1)
            {
                context.beginPath();
                context.strokeStyle = 'rgb(255,0,0)';
                context.moveTo(this.position.x - this.bounds.halfWidth, this.position.y + this.bounds.halfHeight);
                context.lineTo(this.position.x + this.bounds.halfWidth, this.position.y + this.bounds.halfHeight);
                context.stroke();
                context.closePath();
            }

        }

    }

}