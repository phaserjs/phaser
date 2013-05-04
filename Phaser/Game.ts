/// <reference path="AnimationManager.ts" />
/// <reference path="Basic.ts" />
/// <reference path="Cache.ts" />
/// <reference path="CameraManager.ts" />
/// <reference path="Collision.ts" />
/// <reference path="DynamicTexture.ts" />
/// <reference path="FXManager.ts" />
/// <reference path="GameMath.ts" />
/// <reference path="Group.ts" />
/// <reference path="Loader.ts" />
/// <reference path="Motion.ts" />
/// <reference path="Signal.ts" />
/// <reference path="SignalBinding.ts" />
/// <reference path="SoundManager.ts" />
/// <reference path="Stage.ts" />
/// <reference path="Time.ts" />
/// <reference path="TweenManager.ts" />
/// <reference path="World.ts" />
/// <reference path="system/Device.ts" />
/// <reference path="system/RandomDataGenerator.ts" />
/// <reference path="system/RequestAnimationFrame.ts" />
/// <reference path="system/input/Input.ts" />
/// <reference path="system/input/Keyboard.ts" />
/// <reference path="system/input/Mouse.ts" />
/// <reference path="system/input/Touch.ts" />
/// <reference path="gameobjects/Emitter.ts" />
/// <reference path="gameobjects/GameObject.ts" />
/// <reference path="gameobjects/GeomSprite.ts" />
/// <reference path="gameobjects/Particle.ts" />
/// <reference path="gameobjects/Sprite.ts" />
/// <reference path="gameobjects/Tilemap.ts" />
/// <reference path="gameobjects/ScrollZone.ts" />

/**
* Phaser - Game
*
* This is where the magic happens. The Game object is the heart of your game,
* providing quick access to common functions and handling the boot process.
*
* "Hell, there are no rules here - we're trying to accomplish something."
*                                                       Thomas A. Edison
*/

module Phaser {

    export class Game {

        /**
         * Game constructor
         *
         * Instantiate a new <code>Game</code> object.
         *
         * @param callbackContext Which context will the callbacks be called with.
         * @param parent {string} ID of its parent DOM element.
         * @param width {number} The width of your game in game pixels.
         * @param height {number} The height of your game in game pixels.
         * @param initCallback {function} Init callback invoked when init default screen.
         * @param createCallback {function} Create callback invoked when create default screen.
         * @param updateCallback {function} Update callback invoked when update default screen.
         * @param renderCallback {function} Render callback invoked when render default screen.
         */
        constructor(callbackContext, parent?: string = '', width?: number = 800, height?: number = 600, initCallback = null, createCallback = null, updateCallback = null, renderCallback = null) {

            this.callbackContext = callbackContext;
            this.onInitCallback = initCallback;
            this.onCreateCallback = createCallback;
            this.onUpdateCallback = updateCallback;
            this.onRenderCallback = renderCallback;

            if (document.readyState === 'complete' || document.readyState === 'interactive')
            {
                setTimeout(() => this.boot(parent, width, height));
            }
            else
            {
                document.addEventListener('DOMContentLoaded', () => this.boot(parent, width, height), false);
                window.addEventListener('load', () => this.boot(parent, width, height), false);
            }

        }

        /**
         * Game loop trigger wrapper.
         */
        private _raf: RequestAnimationFrame;
        /**
         * Max allowable accumulation.
         * @type {number}
         */
        private _maxAccumulation: number = 32;
        /**
         * Total number of milliseconds elapsed since last update loop.
         * @type {number}
         */
        private _accumulator: number = 0;
        /**
         * Milliseconds of time per step of the game loop.
         * @type {number}
         */
        private _step: number = 0;
        /**
         * Whether loader complete loading or not.
         * @type {boolean}
         */
        private _loadComplete: bool = false;
        /**
         * Game is paused?
         * @type {boolean}
         */
        private _paused: bool = false;
        /**
         * The state to be switched to in the next frame.
         * @type {State}
         */
        private _pendingState = null;

        //  Event callbacks
        /**
         * Context for calling the callbacks.
         */
        public callbackContext;
        /**
         * This will be called when init states. (loading assets...)
         * @type {function}
         */
        public onInitCallback = null;
        /**
         * This will be called when create states. (setup states...)
         * @type {function}
         */
        public onCreateCallback = null;
        /**
         * This will be called when update states.
         * @type {function}
         */
        public onUpdateCallback = null;
        /**
         * This will be called when render states.
         * @type {function}
         */
        public onRenderCallback = null;
        /**
         * This will be called when states paused.
         * @type {function}
         */
        public onPausedCallback = null;

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
        /**
         * Instance of repeatable random data generator helper.
         * @type {RandomDataGenerator}
         */
        public rnd: RandomDataGenerator;
        /**
         * Device detector.
         * @type {Device}
         */
        public device: Device;

        /**
         * Whether the game engine is booted, aka available.
         * @type {boolean}
         */
        public isBooted: bool = false;
        /**
         * Is game running or paused?
         * @type {boolean}
         */
        public isRunning: bool = false;

        /**
         * Initialize engine sub modules and start the game.
         * @param parent {string} ID of parent Dom element.
         * @param width {number} Width of the game screen.
         * @param height {number} Height of the game screen.
         */
        private boot(parent: string, width: number, height: number) {

            if (this.isBooted == true)
            {
                return;
            }

            if (!document.body)
            {
                window.setTimeout(() => this.boot(parent, width, height), 13);
            }
            else
            {
                this.device = new Device();
                this.motion = new Motion(this);
                this.math = new GameMath(this);
                this.stage = new Stage(this, parent, width, height);
                this.world = new World(this, width, height);
                this.sound = new SoundManager(this);
                this.cache = new Cache(this);
                this.collision = new Collision(this);
                this.loader = new Loader(this, this.loadComplete);
                this.time = new Time(this);
                this.tweens = new TweenManager(this);
                this.input = new Input(this);
                this.rnd = new RandomDataGenerator([(Date.now() * Math.random()).toString()]);

                this.framerate = 60;
                this.isBooted = true;

                //  Display the default game screen?
                if (this.onInitCallback == null && this.onCreateCallback == null && this.onUpdateCallback == null && this.onRenderCallback == null && this._pendingState == null)
                {
                    this._raf = new RequestAnimationFrame(this.bootLoop, this);
                }
                else
                {
                    this.isRunning = true;
                    this._loadComplete = false;

                    this._raf = new RequestAnimationFrame(this.loop, this);

                    if (this._pendingState)
                    {
                        this.switchState(this._pendingState, false, false);
                    }
                    else
                    {
                        this.startState();
                    }

                }

            }

        }

        /**
         * Called when the loader has finished after init was run.
         */
        private loadComplete() {

            this._loadComplete = true;

        }

        /**
         * Game loop method will be called when it's booting.
         */
        private bootLoop() {

            this.time.update();
            this.tweens.update();
            this.input.update();
            this.stage.update();

        }

        /**
         * Game loop method will be called when it's paused.
         */
        private pausedLoop() {

            this.time.update();
            this.tweens.update();
            this.input.update();
            this.stage.update();

            if (this.onPausedCallback !== null)
            {
                this.onPausedCallback.call(this.callbackContext);
            }

        }

       /**
         * Game loop method will be called when it's running.
         */
        private loop() {

            this.time.update();
            this.tweens.update();
            this.input.update();
            this.stage.update();

            this._accumulator += this.time.delta;

            if (this._accumulator > this._maxAccumulation)
            {
                this._accumulator = this._maxAccumulation;
            }

            while (this._accumulator >= this._step)
            {
                this.time.elapsed = this.time.timeScale * (this._step / 1000);
                this.world.update();
                this._accumulator = this._accumulator - this._step;
            }

            if (this._loadComplete && this.onUpdateCallback)
            {
                this.onUpdateCallback.call(this.callbackContext);
            }

            this.world.render();

            if (this._loadComplete && this.onRenderCallback)
            {
                this.onRenderCallback.call(this.callbackContext);
            }

        }

        /**
         * Start current state.
         */
        private startState() {

            if (this.onInitCallback !== null)
            {
                this.loader.reset();

                this.onInitCallback.call(this.callbackContext);

                //  Is the loader empty?
                if (this.loader.queueSize == 0)
                {
                    if (this.onCreateCallback !== null)
                    {
                        this.onCreateCallback.call(this.callbackContext);
                    }

                    this._loadComplete = true;
                }
            }
            else
            {
                //  No init? Then there was nothing to load either
                if (this.onCreateCallback !== null)
                {
                    this.onCreateCallback.call(this.callbackContext);
                }

                this._loadComplete = true;
            }

        }

        /**
         * Set all state callbacks (init, create, update, render).
         * @param initCallback {function} Init callback invoked when init state.
         * @param createCallback {function} Create callback invoked when create state.
         * @param updateCallback {function} Update callback invoked when update state.
         * @param renderCallback {function} Render callback invoked when render state.
         */
        public setCallbacks(initCallback = null, createCallback = null, updateCallback = null, renderCallback = null) {

            this.onInitCallback = initCallback;
            this.onCreateCallback = createCallback;
            this.onUpdateCallback = updateCallback;
            this.onRenderCallback = renderCallback;

        }

        /**
         * Switch to a new State.
         * @param state {State} The state you want to switch to.
         * @param clearWorld {boolean} Optional, clear everything in the world? (Default to true)
         * @param clearCache {boolean} Optional, clear asset cache? (Default to false and ONLY available when clearWorld=true)
         */
        public switchState(state, clearWorld: bool = true, clearCache: bool = false) {

            if (this.isBooted == false)
            {
                this._pendingState = state;
                return;
            }

            //  Prototype?
            if (typeof state === 'function')
            {
                state = new state(this);
            }

            //  Ok, have we got the right functions?
            if (state['create'] || state['update'])
            {
                this.callbackContext = state;

                this.onInitCallback = null;
                this.onCreateCallback = null;
                this.onUpdateCallback = null;
                this.onRenderCallback = null;
                this.onPausedCallback = null;

                //  Bingo, let's set them up
                if (state['init'])
                {
                    this.onInitCallback = state['init'];
                }

                if (state['create'])
                {
                    this.onCreateCallback = state['create'];
                }

                if (state['update'])
                {
                    this.onUpdateCallback = state['update'];
                }

                if (state['render'])
                {
                    this.onRenderCallback = state['render'];
                }

                if (state['paused'])
                {
                    this.onPausedCallback = state['paused'];
                }

                if (clearWorld)
                {
                    this.world.destroy();

                    if (clearCache == true)
                    {
                        this.cache.destroy();
                    }
                }

                this._loadComplete = false;

                this.startState();
            }
            else
            {
                throw new Error("Invalid State object given. Must contain at least a create or update function.");
            }

        }

        /**
         * Nuke the whole game from orbit
         */
        public destroy() {

            this.callbackContext = null;
            this.onInitCallback = null;
            this.onCreateCallback = null;
            this.onUpdateCallback = null;
            this.onRenderCallback = null;
            this.onPausedCallback = null;
            this.cache = null;
            this.input = null;
            this.loader = null;
            this.sound = null;
            this.stage = null;
            this.time = null;
            this.world = null;
            this.isBooted = false;

        }

        public get paused(): bool {
            return this._paused;
        }

        public set paused(value: bool) {

            if (value == true && this._paused == false)
            {
                this._paused = true;
                this._raf.setCallback(this.pausedLoop);
            }
            else if (value == false && this._paused == true)
            {
                this._paused = false;
                this.time.time = Date.now();
                this.input.reset();
                if (this.isRunning == false)
                {
                    this._raf.setCallback(this.bootLoop);
                }
                else
                {
                    this._raf.setCallback(this.loop);
                }
            }

        }

        public get framerate(): number {
            return 1000 / this._step;
        }

        public set framerate(value: number) {

            this._step = 1000 / value;

            if (this._maxAccumulation < this._step)
            {
                this._maxAccumulation = this._step;
            }

        }

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
            return this.world.createCamera(x, y, width, height);
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
         * @param key {string} Optinal, key for the sprite sheet you want it to use.
         * @returns {Sprite} The newly created sprite object.
         */
        public createSprite(x: number, y: number, key?: string = ''): Sprite {
            return this.world.createSprite(x, y, key);
        }

        /**
         * Create a new DynamicTexture with specific size.
         *
         * @param width {number} Width of the texture.
         * @param height {number} Height of the texture.
         * @returns {DynamicTexture} The newly created dynamic texture object.
         */
        public createDynamicTexture(width: number, height: number): DynamicTexture {
            return this.world.createDynamicTexture(width, height);
        }

        /**
         * Create a new object container.
         *
         * @param MaxSize {number} Optinal, capacity of this group.
         * @returns {Group} The newly created group.
         */
        public createGroup(MaxSize?: number = 0): Group {
            return this.world.createGroup(MaxSize);
        }

        /**
         * Create a new Particle.
         *
         * @return {Particle} The newly created particle object.
         */
        public createParticle(): Particle {
            return this.world.createParticle();
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
            return this.world.createEmitter(x, y, size);
        }

        /**
         * Create a new ScrollZone object with image key, position and size.
         *
         * @param key {string} Key to a image you wish this object to use.
         * @param x {number} X position of this object.
         * @param y {number} Y position of this object.
         * @param width number} Width of this object.
         * @param height {number} Heigth of this object.
         * @returns {ScrollZone} The newly created scroll zone object.
         */
        public createScrollZone(key: string, x?: number = 0, y?: number = 0, width?: number = 0, height?: number = 0): ScrollZone {
            return this.world.createScrollZone(key, x, y, width, height);
        }

        /**
         * Create a new Tilemap.
         *
         * @param key {string} Key for tileset image.
         * @param mapData {string} Data of this tilemap.
         * @param format {number} Format of map data. (Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON)
         * @param resizeWorld {boolean} Optional, resize the world to make same as tilemap?
         * @param tileWidth {number} Optional, width of each tile.
         * @param tileHeight {number} Optional, height of each tile.
         * @return {Tilemap} The newly created tilemap object.
         */
        public createTilemap(key: string, mapData: string, format: number, resizeWorld: bool = true, tileWidth?: number = 0, tileHeight?: number = 0): Tilemap {
            return this.world.createTilemap(key, mapData, format, resizeWorld, tileWidth, tileHeight);
        }

        /**
         * Create a tween object for a specific object.
         *
         * @param obj Object you wish the tween will affect.
         * @return {Phaser.Tween} The newly created tween object.
         */
        public createTween(obj): Tween {
            return this.tweens.create(obj);
        }

        /**
         * Call this method to see if one object collids another.
         * @return {boolean} Whether the given objects or groups collids.
         */
        public collide(objectOrGroup1: Basic = null, objectOrGroup2: Basic = null, notifyCallback = null): bool {
            return this.collision.overlap(objectOrGroup1, objectOrGroup2, notifyCallback, Collision.separate);
        }

        public get camera(): Camera {
            return this.world.cameras.current;
        }

    }

}