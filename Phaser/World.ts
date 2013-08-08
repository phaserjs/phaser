/// <reference path="_definitions.ts" />

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
        constructor(game: Phaser.Game, width: number, height: number) {

            this.game = game;

            this.cameras = new Phaser.CameraManager(this.game, 0, 0, width, height);

            this.bounds = new Phaser.Rectangle(0, 0, width, height);

        }

        /**
         * Local reference to Game.
         */
        public game: Phaser.Game;

        /**
         * Camera manager of this world.
         * @type {CameraManager}
         */
        public cameras: Phaser.CameraManager;

        /**
         * Object container stores every object created with `create*` methods.
         * @type {Group}
         */
        public group: Phaser.Group;

        /**
         * Bound of this world that objects can not escape from.
         * @type {Rectangle}
         */
        public bounds: Phaser.Rectangle;

        /**
         * The Gravity of the World (defaults to 0,0, or no gravity at all)
         * @type {Vec2}
         */
        public gravity: Phaser.Vec2;

        /**
         * Object container stores every object created with `create*` methods.
         * @type {Group}
         */
        private _groupCounter: number = 0;

        public getNextGroupID(): number {
            return this._groupCounter++;
        }

        /**
         * Called once by Game during the boot process.
         */
        public boot() {

            this.group = new Phaser.Group(this.game, 0);

        }

        /**
         * This is called automatically every frame, and is where main logic happens.
         */
        public update() {

            this.group.update();
            this.cameras.update();

        }

        /**
         * This is called automatically every frame, and is where main logic happens.
         */
        public postUpdate() {

            this.group.postUpdate();
            this.cameras.postUpdate();

        }

        /**
         * Clean up memory.
         */
        public destroy() {

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
        public setSize(width: number, height: number, updateCameraBounds: boolean = true) {

            this.bounds.width = width;
            this.bounds.height = height;

            if (updateCameraBounds == true)
            {
                this.game.camera.setBounds(0, 0, width, height);
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
        public getAllCameras(): Phaser.Camera[] {
            return this.cameras.getAll();
        }

    }

}