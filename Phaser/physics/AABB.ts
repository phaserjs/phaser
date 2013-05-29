/// <reference path="../Game.ts" />
/// <reference path="PhysicsManager.ts" />

/**
* Phaser - Physics - AABB
*/

module Phaser.Physics {

    export class AABB {

        constructor(game: Game, sprite: Sprite, x: number, y: number, width: number, height: number) {

            this.game = game;
            this.world = game.world.physics;
            this.sprite = sprite;

            this.width = width;
            this.height = height;
            this.halfWidth = Math.round(width / 2);
            this.halfHeight = Math.round(height / 2);

            this.position = new Vec2(x + this.halfWidth, y + this.halfHeight);
            this.oldPosition = new Vec2(x + this.halfWidth, y + this.halfHeight);

        }

        /**
         * Local private reference to Game.
         */
        public game: Game;
        public world: PhysicsManager;
        public sprite: Sprite;

        public position: Vec2;
        public oldPosition: Vec2;
        public width: number;
        public height: number;
        public halfWidth: number;
        public halfHeight: number;

        public update() {

            if (this.sprite.physics.moves)
            {
                this.integrate();
                this.collideWorld();
            }

        }

        private integrate() {

            var ox: number = this.oldPosition.x;
            var oy: number = this.oldPosition.y;

            this.oldPosition.x = this.position.x;
            this.oldPosition.y = this.position.y;

            //this.position.x += (this.world.drag.x * this.position.x + this.halfWidth) - (this.world.drag.x * ox) + this.world.gravity.x;
            //this.position.y += (this.world.drag.y * this.position.y + this.halfHeight) - (this.world.drag.y * oy) + this.world.gravity.y;
            this.position.x += (this.world.drag.x * this.position.x) - (this.world.drag.x * ox) + this.world.gravity.x;
            this.position.y += (this.world.drag.y * this.position.y) - (this.world.drag.y * oy) + this.world.gravity.y;

        }

        private collideWorld() {

            //  Collide on the x-axis
            var dx: number = this.world.bounds.x - (this.position.x - this.halfWidth);
            
            if (0 < dx)
            {
                this.processWorld(dx, 0, 1, 0, null);
            }
            else
            {
                dx = (this.position.x + this.halfWidth) - this.world.bounds.right;

                if (0 < dx)
                {
                    this.processWorld(-dx, 0, -1, 0, null);
                }
            }

            //  Collide on the y-axis
            var dy: number = this.world.bounds.y - (this.position.y - this.halfHeight);

            if (0 < dy)
            {
                this.processWorld(0, dy, 0, 1, null);
            }
            else
            {
                dy = (this.position.y + this.halfHeight) - this.world.bounds.bottom;

                if (0 < dy)
                {
                    this.processWorld(0, -dy, 0, -1, null);
                }
            }

        }

        private processWorld(px, py, dx, dy, tile) {

            //  Velocity
            var vx: number = this.position.x - this.oldPosition.x;
            var vy: number = this.position.y - this.oldPosition.y;

            var dp: number = (vx * dx + vy * dy);
            var nx: number = dp * dx;
            var ny: number = dp * dy;
            var tx: number = vx - nx;
            var ty: number = vy - ny;

            var b, bx, by, f, fx, fy;

            if (dp < 0)
            {
                fx = tx * this.world.friction.x;
                fy = ty * this.world.friction.y;
                bx = (nx * (1 + this.world.bounce.x));
                by = (ny * (1 + this.world.bounce.y));
            }
            else
            {
                bx = by = fx = fy = 0;
            }

            this.position.x += px;
            this.position.y += py;

            this.oldPosition.x += px + bx + fx;
            this.oldPosition.y += py + by + fy;

        }

        public render(context:CanvasRenderingContext2D) {

            context.beginPath();
            context.strokeStyle = 'rgb(0,255,0)';
            context.strokeRect(this.position.x - this.halfWidth, this.position.y - this.halfHeight, this.width, this.height);
            context.stroke();
            context.closePath();

            //  center point
            context.fillStyle = 'rgb(0,255,0)';
            context.fillRect(this.position.x, this.position.y, 2, 2);

        }

    }

}