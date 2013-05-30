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
            this.newVelocity = new Vec2(0, 0);

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
        public oH: number;
        public oV: number;

        private _drag: number;

        public newVelocity: Vec2;

        public update() {

            if (this.sprite.physics.moves)
            {
                this.oldPosition.x = this.position.x;
                this.oldPosition.y = this.position.y;

                this.updateMotion();
                this.collideWorld();
            }

        }

        private updateMotion() {

            /*
            var delta: number;
            var velocityDelta: number;

            velocityDelta = (this._game.motion.computeVelocity(this.angularVelocity, this.angularAcceleration, this.angularDrag, this.maxAngular) - this.angularVelocity) / 2;
            this.angularVelocity += velocityDelta;
            this._angle += this.angularVelocity * this._game.time.elapsed;
            this.angularVelocity += velocityDelta;
            */

            //  move to temp vars
            var delta;

            var velocityDelta = (this.computeVelocity(this.sprite.physics.velocity.x, this.sprite.physics.acceleration.x, this.sprite.physics.drag.x) - this.sprite.physics.velocity.x) / 2;
            this.sprite.physics.velocity.x += velocityDelta;
            delta = this.sprite.physics.velocity.x * this.game.time.elapsed;
            this.sprite.physics.velocity.x += velocityDelta;
            this.position.x += delta;

            var velocityDelta = (this.computeVelocity(this.sprite.physics.velocity.y, this.sprite.physics.acceleration.y, this.sprite.physics.drag.y) - this.sprite.physics.velocity.y) / 2;
            this.sprite.physics.velocity.y += velocityDelta;
            delta = this.sprite.physics.velocity.y * this.game.time.elapsed;
            this.sprite.physics.velocity.y += velocityDelta;
            this.position.y += delta;

        }

        /**
        * A tween-like function that takes a starting velocity and some other factors and returns an altered velocity.
        *
        * @param {number} Velocity Any component of velocity (e.g. 20).
        * @param {number} Acceleration Rate at which the velocity is changing.
        * @param {number} Drag Really kind of a deceleration, this is how much the velocity changes if Acceleration is not set.
        * @param {number} Max An absolute value cap for the velocity.
        *
        * @return {number} The altered Velocity value.
        */
        public computeVelocity(velocity: number, acceleration: number = 0, drag: number = 0, max: number = 10000): number {

            if (acceleration !== 0)
            {
                velocity += acceleration * this.game.time.elapsed;
            }
            else if (drag !== 0)
            {
                this._drag = drag * this.game.time.elapsed;

                if (velocity - this._drag > 0)
                {
                    velocity = velocity - this._drag;
                }
                else if (velocity + this._drag < 0)
                {
                    velocity += this._drag;
                }
                else
                {
                    velocity = 0;
                }
            }

            if ((velocity != 0) && (max != 10000))
            {
                if (velocity > max)
                {
                    velocity = max;
                }
                else if (velocity < -max)
                {
                    velocity = -max;
                }
            }

            return velocity;

        }

        private collideWorld() {

            //  Collide on the x-axis
            var dx: number = this.world.bounds.x - (this.position.x - this.halfWidth);
            
            if (0 < dx)
            {
                //  Hit Left
                this.oH = 1;
                this.position.x += dx;

                if (this.sprite.physics.bounce.x > 0)
                {
                    this.sprite.physics.velocity.x *= -(this.sprite.physics.bounce.x);
                }
                else
                {
                    this.sprite.physics.velocity.x = 0;
                }
            }
            else
            {
                dx = (this.position.x + this.halfWidth) - this.world.bounds.right;

                if (0 < dx)
                {
                    //  Hit Right
                    this.oH = -1;
                    this.position.x -= dx;

                    if (this.sprite.physics.bounce.x > 0)
                    {
                        this.sprite.physics.velocity.x *= -(this.sprite.physics.bounce.x);
                    }
                    else
                    {
                        this.sprite.physics.velocity.x = 0;
                    }
                }
            }

            //  Collide on the y-axis
            var dy: number = this.world.bounds.y - (this.position.y - this.halfHeight);

            if (0 < dy)
            {
                //  Hit Top
                this.oV = 1;
                this.position.y += dy;

                if (this.sprite.physics.bounce.y > 0)
                {
                    this.sprite.physics.velocity.y *= -(this.sprite.physics.bounce.y);
                }
                else
                {
                    this.sprite.physics.velocity.y = 0;
                }
            }
            else
            {
                dy = (this.position.y + this.halfHeight) - this.world.bounds.bottom;

                if (0 < dy)
                {
                    //  Hit Bottom
                    this.oV = -1;
                    this.position.y -= dy;

                    if (this.sprite.physics.bounce.y > 0)
                    {
                        this.sprite.physics.velocity.y *= -(this.sprite.physics.bounce.y);
                    }
                    else
                    {
                        this.sprite.physics.velocity.y = 0;
                    }
                }
            }

        }

        private processWorld(px, py, dx, dy, tile) {

            //  Velocity
            //this.sprite.physics.velocity.x = this.position.x - this.oldPosition.x;
            //this.sprite.physics.velocity.y = this.position.y - this.oldPosition.y;

            //  Optimise!!!
            var dp: number = (this.sprite.physics.velocity.x * dx + this.sprite.physics.velocity.y * dy);
            var nx: number = dp * dx;
            var ny: number = dp * dy;
            var tx: number = this.sprite.physics.velocity.x - nx;
            var ty: number = this.sprite.physics.velocity.y - ny;

            var bx, by, fx, fy;

            if (dp < 0)
            {
                fx = tx * this.sprite.physics.friction.x;
                fy = ty * this.sprite.physics.friction.y;
                bx = (nx * (1 + this.sprite.physics.bounce.x));
                by = (ny * (1 + this.sprite.physics.bounce.y));
                //this.sprite.physics.velocity.x = bx;
                //this.sprite.physics.velocity.y = by;
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

            if (this.oH == 1)
            {
                context.beginPath();
                context.strokeStyle = 'rgb(255,0,0)';
                context.moveTo(this.position.x - this.halfWidth, this.position.y - this.halfHeight);
                context.lineTo(this.position.x - this.halfWidth, this.position.y + this.halfHeight);
                context.stroke();
                context.closePath();
            }
            else if (this.oH == -1)
            {
                context.beginPath();
                context.strokeStyle = 'rgb(255,0,0)';
                context.moveTo(this.position.x + this.halfWidth, this.position.y - this.halfHeight);
                context.lineTo(this.position.x + this.halfWidth, this.position.y + this.halfHeight);
                context.stroke();
                context.closePath();
            }

            if (this.oV == 1)
            {
                context.beginPath();
                context.strokeStyle = 'rgb(255,0,0)';
                context.moveTo(this.position.x - this.halfWidth, this.position.y - this.halfHeight);
                context.lineTo(this.position.x + this.halfWidth, this.position.y - this.halfHeight);
                context.stroke();
                context.closePath();
            }
            else if (this.oV == -1)
            {
                context.beginPath();
                context.strokeStyle = 'rgb(255,0,0)';
                context.moveTo(this.position.x - this.halfWidth, this.position.y + this.halfHeight);
                context.lineTo(this.position.x + this.halfWidth, this.position.y + this.halfHeight);
                context.stroke();
                context.closePath();
            }


        }

    }

}