/// <reference path="../../core/Vec2.ts" />
/// <reference path="../../core/Point.ts" />
/// <reference path="../../physics/AABB.ts" />

/**
* Phaser - Components - Physics
*
* 
*/

module Phaser.Components {

    export class Physics {

        constructor(parent: Sprite) {

            this._game = parent.game;
            this._sprite = parent;

            //  Copy from PhysicsManager?
            this.gravity = new Vec2;
            this.drag = new Vec2;
            this.bounce = new Vec2;
            this.friction = new Vec2;
            this.velocity = new Vec2;
            this.acceleration = new Vec2;

            //this.AABB = new Phaser.Physics.AABB(this._game, this._sprite, this._sprite.x, this._sprite.y, this._sprite.width, this._sprite.height);
            this.shape = this._game.world.physics.add(new Phaser.Physics.AABB(this._game, this._sprite, this._sprite.x, this._sprite.y, this._sprite.width, this._sprite.height));

        }

        /**
         * 
         */
        private _game: Game;

        /**
         * 
         */
        private _sprite: Sprite;

        public shape: Phaser.Physics.IPhysicsShape;

        /**
         * Whether this object will be moved by impacts with other objects or not.
         * @type {boolean}
         */
        public immovable: bool;

        /**
         * Set this to false if you want to skip the automatic movement stuff
         * @type {boolean}
         */
        public moves: bool = true;

        public gravity: Vec2;
        public drag: Vec2;
        public bounce: Vec2;
        public friction: Vec2;
        public velocity: Vec2;
        public acceleration: Vec2;

        /**
         * Internal function for updating the position and speed of this object.
         */
        public update() {

            if (this.moves)
            {
                this._sprite.x = (this.shape.position.x - this.shape.bounds.halfWidth) - this.shape.offset.x;
                this._sprite.y = (this.shape.position.y - this.shape.bounds.halfHeight) - this.shape.offset.y;
                //this._sprite.x = (this.shape.position.x - this.shape.bounds.halfWidth);
                //this._sprite.y = (this.shape.position.y - this.shape.bounds.halfHeight);
                //this._sprite.x = (this.shape.position.x);
                //this._sprite.y = (this.shape.position.y);
            }
        }

        /**
         * Render debug infos. (including name, bounds info, position and some other properties)
         * @param x {number} X position of the debug info to be rendered.
         * @param y {number} Y position of the debug info to be rendered.
         * @param [color] {number} color of the debug info to be rendered. (format is css color string)
         */
        public renderDebugInfo(x: number, y: number, color?: string = 'rgb(255,255,255)') {

            this._sprite.texture.context.fillStyle = color;
            this._sprite.texture.context.fillText('Sprite: (' + this._sprite.frameBounds.width + ' x ' + this._sprite.frameBounds.height + ')', x, y);
            this._sprite.texture.context.fillText('x: ' + this._sprite.frameBounds.x.toFixed(1) + ' y: ' + this._sprite.frameBounds.y.toFixed(1) + ' rotation: ' + this._sprite.rotation.toFixed(1), x, y + 14);
            this._sprite.texture.context.fillText('vx: ' + this.velocity.x.toFixed(1) + ' vy: ' + this.velocity.y.toFixed(1), x, y + 28);
            this._sprite.texture.context.fillText('ax: ' + this.acceleration.x.toFixed(1) + ' ay: ' + this.acceleration.y.toFixed(1), x, y + 42);

        }

    }

}