/// <reference path="Game.ts" />

/**
* Phaser - State
*
* This is a base State class which can be extended if you are creating your game using TypeScript.
*/

module Phaser {

    export class State {

        /**
         * State constructor
         * Create a new <code>State</code>.
         */
        constructor(game: Game) {

            this.game = game;

            this.camera = game.camera;
            this.cache = game.cache;
            this.collision = game.collision;
            this.input = game.input;
            this.loader = game.loader;
            this.math = game.math;
            this.motion = game.motion;
            this.sound = game.sound;
            this.stage = game.stage;
            this.time = game.time;
            this.tweens = game.tweens;
            this.world = game.world;

        }

        /**
         * Reference to Game.
         */
        public game: Game;

        /**
         * Currently used camera.
         * @type {Camera}
         */
        public camera: Camera;
        /**
         * Reference to the assets cache.
         * @type {Cache}
         */
        public cache: Cache;
        /**
         * Reference to the collision helper.
         * @type {Collision}
         */
        public collision: Collision;
        /**
         * Reference to the input manager
         * @type {Input}
         */
        public input: Input;
        /**
         * Reference to the assets loader.
         * @type {Loader}
         */
        public loader: Loader;
        /**
         * Reference to the math helper.
         * @type {GameMath}
         */
        public math: GameMath;
        /**
         * Reference to the motion helper.
         * @type {Motion}
         */
        public motion: Motion;
        /**
         * Reference to the sound manager.
         * @type {SoundManager}
         */
        public sound: SoundManager;
        /**
         * Reference to the stage.
         * @type {Stage}
         */
        public stage: Stage;
        /**
         * Reference to game clock.
         * @type {Time}
         */
        public time: Time;
        /**
         * Reference to the tween manager.
         * @type {TweenManager}
         */
        public tweens: TweenManager;
        /**
         * Reference to the world.
         * @type {World}
         */
        public world: World;


        //  Overload these in your own States
        /**
         * Override this method to add some load operations.
         * If you need to use the loader, you may need to use them here.
         */
        public init() { }
        /**
         * This method is called after the game engine successfully switches states.
         * Feel free to add any setup code here.(Do not load anything here, override init() instead)
         */
        public create() { }
        /**
         * Put update logic here.
         */
        public update() { }
        /**
         * Put render operations here.
         */
        public render() { }
        /**
         * This method will be called when game paused.
         */
        public paused() { }

        //  Handy Proxy methods

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
            return this.game.world.createCamera(x, y, width, height);
        }

        /**
         * Create a new GeomSprite with specific position.
         *
         * @param x {number} X position of the new geom sprite.
         * @param y {number} Y position of the new geom sprite.
         * @returns {GeomSprite} The newly created geom sprite object.
         */
        public createGeomSprite(x: number, y: number): GeomSprite {
            return this.world.createGeomSprite(x, y);
        }

        /**
         * Create a new Sprite with specific position and sprite sheet key.
         *
         * @param x {number} X position of the new sprite.
         * @param y {number} Y position of the new sprite.
         * @param key {string} [optional] key for the sprite sheet you want it to use.
         * @returns {Sprite} The newly created sprite object.
         */
        public createSprite(x: number, y: number, key?: string = ''): Sprite {
            return this.game.world.createSprite(x, y, key);
        }

        /**
         * Create a new DynamicTexture with specific size.
         *
         * @param width {number} Width of the texture.
         * @param height {number} Height of the texture.
         * @returns {DynamicTexture} The newly created dynamic texture object.
         */
        public createDynamicTexture(width: number, height: number): DynamicTexture {
            return this.game.world.createDynamicTexture(width, height);
        }

        /**
         * Create a new object container.
         *
         * @param MaxSize {number} [optional] capacity of this group.
         * @returns {Group} The newly created group.
         */
        public createGroup(MaxSize?: number = 0): Group {
            return this.game.world.createGroup(MaxSize);
        }

        /**
         * Create a new Particle.
         *
         * @return {Particle} The newly created particle object.
         */
        public createParticle(): Particle {
            return this.game.world.createParticle();
        }

        /**
         * Create a new Emitter.
         *
         * @param x {number} [optional] x position of the emitter.
         * @param y {number} [optional] y position of the emitter.
         * @param size {number} [optional] size of this emitter.
         * @return {Emitter} The newly created emitter object.
         */
        public createEmitter(x?: number = 0, y?: number = 0, size?: number = 0): Emitter {
            return this.game.world.createEmitter(x, y, size);
        }

        /**
         * Create a new ScrollZone object with image key, position and size.
         *
         * @param key {string} Key to a image you wish this object to use.
         * @param x {number} X position of this object.
         * @param y {number} Y position of this object.
         * @param width {number} Width of this object.
         * @param height {number} Height of this object.
         * @returns {ScrollZone} The newly created scroll zone object.
         */
        public createScrollZone(key: string, x?: number = 0, y?: number = 0, width?: number = 0, height?: number = 0): ScrollZone {
            return this.game.world.createScrollZone(key, x, y, width, height);
        }

        /**
         * Create a new Tilemap.
         *
         * @param key {string} Key for tileset image.
         * @param mapData {string} Data of this tilemap.
         * @param format {number} Format of map data. (Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON)
         * @param resizeWorld {boolean} [optional] resize the world to make same as tilemap?
         * @param tileWidth {number} [optional] width of each tile.
         * @param tileHeight number} [optional] height of each tile.
         * @return {Tilemap} The newly created tilemap object.
         */
        public createTilemap(key: string, mapData: string, format: number, resizeWorld: bool = true, tileWidth?: number = 0, tileHeight?: number = 0): Tilemap {
            return this.game.world.createTilemap(key, mapData, format, resizeWorld, tileWidth, tileHeight);
        }

        /**
         * Create a tween object for a specific object.
         *
         * @param obj Object you wish the tween will affect.
         * @return {Phaser.Tween} The newly created tween object.
         */
        public createTween(obj): Tween {
            return this.game.tweens.create(obj);
        }

        /**
         * Call this method to see if one object collids another.
         * @return {boolean} Whether the given objects or groups collids.
         */
        public collide(ObjectOrGroup1: Basic = null, ObjectOrGroup2: Basic = null, NotifyCallback = null): bool {
            return this.collision.overlap(ObjectOrGroup1, ObjectOrGroup2, NotifyCallback, Collision.separate);
        }

    }

}