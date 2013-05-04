/// <reference path="Game.ts" />

/**
* Phaser - World
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

            this._game.camera = this.cameras.current;

            this.group = new Group(this._game, 0);

            this.bounds = new Rectangle(0, 0, width, height);

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
         * @type {number}
         */
        public worldDivisions: number;

        /**
         * This is called automatically every frame, and is where main logic performs.
         */
        public update() {

            this.group.preUpdate();
            this.group.update();
            this.group.postUpdate();

            this.cameras.update();

        }

        /**
         * Render every thing to the screen, automatically called after update().
         */
        public render() {

            //  Unlike in flixel our render process is camera driven, not group driven
            this.cameras.render();

        }

        /**
         * Clean up memory.
         */
        public destroy() {

            this.group.destroy();

            this.cameras.destroy();

        }

        //  World methods

        /**
         * Update size of this world with specific width and height.
         * You can choose update camera bounds automatically or not.
         *
         * @param width {number} New width of the world.
         * @param height {number} New height of the world.
         * @param updateCameraBounds {boolean} Optinal, update camera bounds automatically or not. Default to true.
         */
        public setSize(width: number, height: number, updateCameraBounds: bool = true) {

            this.bounds.width = width;
            this.bounds.height = height;

            if (updateCameraBounds == true)
            {
                this._game.camera.setBounds(0, 0, width, height);
            }

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

        //  Cameras

        /**
         * Create a new camera with specific position and size.
         *
         * @param x {number} X position of the new camera.
         * @param y {number} Y position of the new camera.
         * @param width {number} Width of the new camera.
         * @param height {number} Height of the new camera.
         * @returns {Camera} The newly created camera object.
         */
        public createCamera(x: number, y: number, width: number, height: number): Camera {
            return this.cameras.addCamera(x, y, width, height);
        }

        /**
         * Remove a new camera with its id.
         *
         * @param id {number} ID of the camera you want to remove.
         * @returns {boolean}   True if successfully removed the camera, otherwise return false.
         */
        public removeCamera(id: number): bool {
            return this.cameras.removeCamera(id);
        }

        /**
         * Get all the cameras.
         *
         * @returns {array} An array contains all the cameras.
         */
        public getAllCameras(): Camera[] {
            return this.cameras.getAll();
        }

        //  Game Objects

        /**
         * Create a new Sprite with specific position and sprite sheet key.
         *
         * @param x {number} X position of the new sprite.
         * @param y {number} Y position of the new sprite.
         * @param key {string} Optinal, key for the sprite sheet you want it to use.
         * @returns {Sprite} The newly created sprite object.
         */
        public createSprite(x: number, y: number, key?: string = ''): Sprite {
            return <Sprite> this.group.add(new Sprite(this._game, x, y, key));
        }

        /**
         * Create a new GeomSprite with specific position.
         *
         * @param x {number} X position of the new geom sprite.
         * @param y {number} Y position of the new geom sprite.
         * @returns {GeomSprite} The newly created geom sprite object.
         */
        public createGeomSprite(x: number, y: number): GeomSprite {
            return <GeomSprite> this.group.add(new GeomSprite(this._game, x, y));
        }

        /**
         * Create a new DynamicTexture with specific size.
         *
         * @param width {number} Width of the texture.
         * @param height {number} Height of the texture.
         * @returns {DynamicTexture} The newly created dynamic texture object.
         */
        public createDynamicTexture(width: number, height: number): DynamicTexture {
            return new DynamicTexture(this._game, width, height);
        }

        /**
         * Create a new object container.
         *
         * @param MaxSize {number} Optinal, capacity of this group.
         * @returns {Group} The newly created group.
         */
        public createGroup(MaxSize?: number = 0): Group {
            return <Group> this.group.add(new Group(this._game, MaxSize));
        }

        /**
         * Create a new ScrollZone object with image key, position and size.
         *
         * @param key {number} Key to a image you wish this object to use.
         * @param x {number} X position of this object.
         * @param y {number} Y position of this object.
         * @param width {number} Width of this object.
         * @param height {number} Heigth of this object.
         * @returns {ScrollZone} The newly created scroll zone object.
         */
        public createScrollZone(key: string, x?: number = 0, y?: number = 0, width?: number = 0, height?: number = 0): ScrollZone {
            return <ScrollZone> this.group.add(new ScrollZone(this._game, key, x, y, width, height));
        }

        /**
         * Create a new Tilemap.
         *
         * @param key {string} Key for tileset image.
         * @param mapData {string} Data of this tilemap.
         * @param format {number} Format of map data. (Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON)
         * @param resizeWorld {boolean} Optinal, resize the world to make same as tilemap?
         * @param tileWidth {number} Optinal, width of each tile.
         * @param tileHeight {number} Optinal, height of each tile.
         * @return {Tilemap} The newly created tilemap object.
         */
        public createTilemap(key: string, mapData: string, format: number, resizeWorld: bool = true, tileWidth?: number = 0, tileHeight?: number = 0): Tilemap {
            return <Tilemap> this.group.add(new Tilemap(this._game, key, mapData, format, resizeWorld, tileWidth, tileHeight));
        }

        /**
         * Create a new Particle.
         *
         * @return {Particle} The newly created particle object.
         */
        public createParticle(): Particle {
            return new Particle(this._game);
        }

        /**
         * Create a new Emitter.
         *
         * @param x {number} Optinal, x position of the emitter.
         * @param y {number} Optinal, y position of the emitter.
         * @param size {number} Optinal, size of this emitter.
         * @return {Emitter} The newly created emitter object.
         */
        public createEmitter(x?: number = 0, y?: number = 0, size?: number = 0): Emitter {
            return <Emitter> this.group.add(new Emitter(this._game, x, y, size));
        }

    }

}