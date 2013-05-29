/// <reference path="Game.ts" />
/// <reference path="cameras/CameraManager.ts" />
/// <reference path="core/Group.ts" />
/// <reference path="core/Rectangle.ts" />
/// <reference path="physics/PhysicsManager.ts" />

/**
* Phaser - World
*
* "This world is but a canvas to our imagination." - Henry David Thoreau
*
* A game has only one world. The world is an abstract place in which all game objects live. It is not bound
* by stage limits and can be any size or dimension. You look into the world via cameras and all game objects
* live within the world at world-based coordinates. By default a world is created the same size as your Stage.
*/

module Phaser {

    export class World {

        /**
         * World constructor
         * Create a new <code>World</code> with specific width and height.
         *
         * @param width {number} Width of the world bound.
         * @param height {number} Height of the world bound.
         */
        constructor(game: Game, width: number, height: number) {

            this._game = game;

            this.cameras = new CameraManager(this._game, 0, 0, width, height);

            this.group = new Group(this._game, 0);

            this.bounds = new Rectangle(0, 0, width, height);

            this.physics = new Physics.PhysicsManager(this._game, width, height);

            this.worldDivisions = 6;

        }

        /**
         * Local private reference to game.
         */
        private _game: Game;

        /**
         * Camera manager of this world.
         * @type {CameraManager}
         */
        public cameras: CameraManager;

        /**
         * Object container stores every object created with `create*` methods.
         * @type {Group}
         */
        public group: Group;

        /**
         * Bound of this world that objects can not escape from.
         * @type {Rectangle}
         */
        public bounds: Rectangle;

        /**
         * Reference to the physics manager.
         * @type {Physics.PhysicsManager}
         */
        public physics: Physics.PhysicsManager;

        /**
         * @type {number}
         */
        public worldDivisions: number;

        /**
         * This is called automatically every frame, and is where main logic happens.
         */
        public update() {

            this.physics.update();
            this.group.update();
            this.cameras.update();

        }

        /**
         * Clean up memory.
         */
        public destroy() {

            //this.physics.destroy();
            this.group.destroy();
            this.cameras.destroy();

        }

        /**
         * Updates the size of this world.
         *
         * @param width {number} New width of the world.
         * @param height {number} New height of the world.
         * @param [updateCameraBounds] {boolean} Update camera bounds automatically or not. Default to true.
         */
        public setSize(width: number, height: number, updateCameraBounds: bool = true, updatePhysicsBounds: bool = true) {

            this.bounds.width = width;
            this.bounds.height = height;

            if (updateCameraBounds == true)
            {
                this._game.camera.setBounds(0, 0, width, height);
            }

            if (updatePhysicsBounds == true)
            {
                //this.physics.bounds.copyFrom(this.bounds);
            }

            // dispatch world resize event

        }

        public get width(): number {
            return this.bounds.width;
        }

        public set width(value: number) {
            this.bounds.width = value;
        }

        public get height(): number {
            return this.bounds.height;
        }

        public set height(value: number) {
            this.bounds.height = value;
        }

        public get centerX(): number {
            return this.bounds.halfWidth;
        }

        public get centerY(): number {
            return this.bounds.halfHeight;
        }

        public get randomX(): number {
            return Math.round(Math.random() * this.bounds.width);
        }

        public get randomY(): number {
            return Math.round(Math.random() * this.bounds.height);
        }

        /**
         * Get all the cameras.
         *
         * @returns {array} An array contains all the cameras.
         */
        public getAllCameras(): Camera[] {
            return this.cameras.getAll();
        }

    }

}