/// <reference path="geom/Rectangle.ts" />
/// <reference path="math/LinkedList.ts" />
/// <reference path="math/QuadTree.ts" />
/// <reference path="geom/Point.ts" />
/// <reference path="math/Vec2.ts" />
/// <reference path="geom/Circle.ts" />
/// <reference path="core/Group.ts" />
/// <reference path="core/Signal.ts" />
/// <reference path="core/SignalBinding.ts" />
/// <reference path="loader/Loader.ts" />
/// <reference path="loader/Cache.ts" />
/// <reference path="math/GameMath.ts" />
/// <reference path="math/RandomDataGenerator.ts" />
/// <reference path="cameras/CameraManager.ts" />
/// <reference path="gameobjects/GameObjectFactory.ts" />
/// <reference path="sound/SoundManager.ts" />
/// <reference path="Stage.ts" />
/// <reference path="Time.ts" />
/// <reference path="tweens/TweenManager.ts" />
/// <reference path="World.ts" />
/// <reference path="Motion.ts" />
/// <reference path="system/Device.ts" />
/// <reference path="system/RequestAnimationFrame.ts" />
/// <reference path="input/Input.ts" />
/// <reference path="renderers/IRenderer.ts" />
/// <reference path="renderers/HeadlessRenderer.ts" />
/// <reference path="renderers/CanvasRenderer.ts" />
/// <reference path="utils/DebugUtils.ts" />

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
         * Instantiate a new <code>Phaser.Game</code> object.
         *
         * @param callbackContext Which context will the callbacks be called with.
         * @param parent {string} ID of its parent DOM element.
         * @param width {number} The width of your game in game pixels.
         * @param height {number} The height of your game in game pixels.
         * @param initCallback {function} Init callback invoked when init default screen.
         * @param createCallback {function} Create callback invoked when create default screen.
         * @param updateCallback {function} Update callback invoked when update default screen.
         * @param renderCallback {function} Render callback invoked when render default screen.
         * @param destroyCallback {function} Destroy callback invoked when state is destroyed.
         */
        constructor(callbackContext, parent?: string = '', width?: number = 800, height?: number = 600, initCallback = null, createCallback = null, updateCallback = null, renderCallback = null, destroyCallback = null) {

            this.callbackContext = callbackContext;
            this.onInitCallback = initCallback;
            this.onCreateCallback = createCallback;
            this.onUpdateCallback = updateCallback;
            this.onRenderCallback = renderCallback;
            this.onDestroyCallback = destroyCallback;

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
        public _raf: RequestAnimationFrame;

        /**
         * Milliseconds of time per step of the game loop.
         * @type {number}
         */
        private _step: number = 0;

        /**
         * Whether load complete loading or not.
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

        /**
         * The current State object (defaults to null)
         * @type {State}
         */
        public state = null;

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
         * This will be called when the state is destroyed (i.e. swapping to a new state)
         * @type {function}
         */
        public onDestroyCallback = null;

        /**
         * Reference to the GameObject Factory.
         * @type {GameObjectFactory}
         */
        public add: GameObjectFactory;

        /**
         * Reference to the assets cache.
         * @type {Cache}
         */
        public cache: Cache;

        /**
         * Reference to the input manager
         * @type {Input}
         */
        public input: Input;

        /**
         * Reference to the assets loader.
         * @type {Loader}
         */
        public load: Loader;

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
         * Reference to the physics manager.
         * @type {Physics.Manager}
         */
        public physics: Physics.Manager;

        /**
         * Instance of repeatable random data generator helper.
         * @type {RandomDataGenerator}
         */
        public rnd: RandomDataGenerator;

        /**
         * Contains device information and capabilities.
         * @type {Device}
         */
        public device: Device;

        /**
         * Reference to the render manager
         * @type {RenderManager}
         */
        public renderer: IRenderer;

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
                this.add = new GameObjectFactory(this);
                this.sound = new SoundManager(this);
                this.cache = new Cache(this);
                this.load = new Loader(this, this.loadComplete);
                this.time = new Time(this);
                this.tweens = new TweenManager(this);
                this.input = new Input(this);
                this.rnd = new RandomDataGenerator([(Date.now() * Math.random()).toString()]);
                this.physics = new Physics.Manager(this);

                this.setRenderer(Phaser.Types.RENDERER_CANVAS);

                this.world.boot();
                this.stage.boot();
                this.input.boot();

                this.isBooted = true;

                //  Set-up some static helper references
                DebugUtils.game = this;
                ColorUtils.game = this;
                DebugUtils.context = this.stage.context;

                //  Display the default game screen?
                if (this.onInitCallback == null && this.onCreateCallback == null && this.onUpdateCallback == null && this.onRenderCallback == null && this._pendingState == null)
                {
                    this._raf = new RequestAnimationFrame(this, this.bootLoop);
                }
                else
                {
                    this.isRunning = true;
                    this._loadComplete = false;

                    this._raf = new RequestAnimationFrame(this, this.loop);

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

        public setRenderer(type: number) {

            switch (type)
            {
                case Phaser.Types.RENDERER_AUTO_DETECT:
                    this.renderer = new Phaser.HeadlessRenderer(this);
                    break;

                case Phaser.Types.RENDERER_AUTO_DETECT:
                case Phaser.Types.RENDERER_CANVAS:
                    this.renderer = new Phaser.CanvasRenderer(this);
                    break;

                // WebGL coming soon :)
            }

        }

        /**
         * Called when the load has finished after init was run.
         */
        private loadComplete() {

            this._loadComplete = true;

        }

        /**
         * The bootLoop is called while the game is still booting (waiting for the DOM and resources to be available)
         */
        private bootLoop() {

            this.tweens.update();
            this.input.update();
            this.stage.update();

        }

        /**
         * The pausedLoop is called when the game is paused.
         */
        private pausedLoop() {

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

            this.tweens.update();
            this.input.update();
            this.stage.update();
            this.physics.update();
            this.world.update();

            if (this._loadComplete && this.onUpdateCallback)
            {
                this.onUpdateCallback.call(this.callbackContext);
            }

            this.world.postUpdate();

            this.renderer.render();

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
                this.load.reset();

                this.onInitCallback.call(this.callbackContext);

                //  Is the load empty?
                if (this.load.queueSize == 0)
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
         * @param destroyCallback {function} Destroy callback invoked when state is destroyed.
         */
        public setCallbacks(initCallback = null, createCallback = null, updateCallback = null, renderCallback = null, destroyCallback = null) {

            this.onInitCallback = initCallback;
            this.onCreateCallback = createCallback;
            this.onUpdateCallback = updateCallback;
            this.onRenderCallback = renderCallback;
            this.onDestroyCallback = destroyCallback;

        }

        /**
         * Switch to a new State.
         * @param state {State} The state you want to switch to.
         * @param [clearWorld] {boolean} clear everything in the world? (Default to true)
         * @param [clearCache] {boolean} clear asset cache? (Default to false and ONLY available when clearWorld=true)
         */
        public switchState(state, clearWorld: bool = true, clearCache: bool = false) {

            if (this.isBooted == false)
            {
                this._pendingState = state;
                return;
            }

            //  Destroy current state?
            if (this.onDestroyCallback !== null)
            {
                this.onDestroyCallback.call(this.callbackContext);
            }

            this.input.reset(true);

            //  Prototype?
            if (typeof state === 'function')
            {
                this.state = new state(this);
            }

            //  Ok, have we got the right functions?
            if (this.state['create'] || this.state['update'])
            {
                this.callbackContext = this.state;

                this.onInitCallback = null;
                this.onCreateCallback = null;
                this.onUpdateCallback = null;
                this.onRenderCallback = null;
                this.onPausedCallback = null;
                this.onDestroyCallback = null;

                //  Bingo, let's set them up
                if (this.state['init'])
                {
                    this.onInitCallback = this.state['init'];
                }

                if (this.state['create'])
                {
                    this.onCreateCallback = this.state['create'];
                }

                if (this.state['update'])
                {
                    this.onUpdateCallback = this.state['update'];
                }

                if (this.state['render'])
                {
                    this.onRenderCallback = this.state['render'];
                }

                if (this.state['paused'])
                {
                    this.onPausedCallback = this.state['paused'];
                }

                if (this.state['destroy'])
                {
                    this.onDestroyCallback = this.state['destroy'];
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
         * Nuke the entire game from orbit
         */
        public destroy() {

            this.callbackContext = null;
            this.onInitCallback = null;
            this.onCreateCallback = null;
            this.onUpdateCallback = null;
            this.onRenderCallback = null;
            this.onPausedCallback = null;
            this.onDestroyCallback = null;
            this.cache = null;
            this.input = null;
            this.load = null;
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
                this._raf.callback = this.pausedLoop;
            }
            else if (value == false && this._paused == true)
            {
                this._paused = false;
                //this.time.time = window.performance.now ? (performance.now() + performance.timing.navigationStart) : Date.now();
                this.input.reset();

                if (this.isRunning == false)
                {
                    this._raf.callback = this.bootLoop;
                }
                else
                {
                    this._raf.callback = this.loop;
                }
            }

        }

        /**
         * Checks for overlaps between two objects using the world QuadTree. Can be GameObject vs. GameObject, GameObject vs. Group or Group vs. Group.
         * Note: Does not take the objects scrollFactor into account. All overlaps are check in world space.
         * @param object1 The first GameObject or Group to check. If null the world.group is used.
         * @param object2 The second GameObject or Group to check.
         * @param notifyCallback A callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you passed them to Collision.overlap.
         * @param processCallback A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then notifyCallback will only be called if processCallback returns true.
         * @param context The context in which the callbacks will be called
         * @returns {boolean} true if the objects overlap, otherwise false.
         */
        public collide(objectOrGroup1 = null, objectOrGroup2 = null, notifyCallback = null, context? = this.callbackContext): bool {
            //return this.world.physics.overlap(objectOrGroup1, objectOrGroup2, notifyCallback, this.world.physics.separate, context);
            return false;
        }

        public get camera(): Camera {
            return this.world.cameras.current;
        }

    }

}