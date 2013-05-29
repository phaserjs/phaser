/// <reference path="../Game.ts" />

/**
* Phaser - PhysicsManager
*
* Your game only has one PhysicsManager instance and it's responsible for looking after, creating and colliding
* all of the physics objects in the world.
*/

module Phaser.Physics {

    export class PhysicsManager {

        constructor(game: Game, width: number, height: number) {

            this._game = game;

            this.gravity = new Vec2(0, 0.2);
            this.drag = new Vec2(1, 1);
            this.bounce = new Vec2(0.3, 0.7);
            this.friction = new Vec2(0.05, 0.05);

            this.bounds = new Rectangle(0, 0, width, height); 

            this._objects = [];

        }

        /**
         * Local private reference to Game.
         */
        private _game: Game;

        private _objects;

        public bounds: Rectangle;

        public gravity: Vec2;
        public drag: Vec2;
        public bounce: Vec2;
        public friction: Vec2;

        private minFriction: number = 0;
        private maxFriction: number = 1;

        private minBounce: number = 0;
        private maxBounce: number = 1;

        private minGravity: number = 0;
        private maxGravity: number = 1;

        private _i: number = 0;
        private _length: number = 0;

        public add(o) {
            this._objects.push(o);
            this._length++;
            return o;
        }

        public update() {

            //  iterate through the objects here, updating and colliding
            for (this._i = 0; this._i < this._length; this._i++)
            {
                this._objects[this._i].update();
            }

        }

        public render() {

            //  iterate through the objects here, updating and colliding
            for (this._i = 0; this._i < this._length; this._i++)
            {
                this._objects[this._i].render(this._game.stage.context);
            }

        }

    }

}