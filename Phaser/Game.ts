/// <reference path="_definitions.ts" />

/**
 * Game
 *
 * This is where the magic happens. The Game object is the heart of your game,
 * providing quick access to common functions and handling the boot process.
 *
 * "Hell, there are no rules here - we're trying to accomplish something."
 *                                                       Thomas A. Edison
 *
 * @package    Phaser.Game
 * @author     Richard Davey <rich@photonstorm.com>
 * @copyright  2013 Photon Storm Ltd.
 * @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
 */

module Phaser {

    export class Game {

        /**
         * Game constructor
         *
         * Instantiate a new <code>Phaser.Game</code> object.
         *
         * @constructor
         * @param callbackContext Which context will the callbacks be called with.
         * @param parent {string} ID of its parent DOM element.
         * @param width {number} The width of your game in game pixels.
         * @param height {number} The height of your game in game pixels.
         * @param preloadCallback {function} Preload callback invoked when init default screen.
         * @param createCallback {function} Create callback invoked when create default screen.
         * @param updateCallback {function} Update callback invoked when update default screen.
         * @param renderCallback {function} Render callback invoked when render default screen.
         * @param destroyCallback {function} Destroy callback invoked when state is destroyed.
         */
        constructor(callbackContext, parent: string = '', width: number = 800, height: number = 600, preloadCallback = null, createCallback = null, updateCallback = null, renderCallback = null, destroyCallback = null) {

            //  Single instance check
            if (window['PhaserGlobal'] && window['PhaserGlobal'].singleInstance)
            {
                if (Phaser.GAMES.length > 0)
                {
                    console.log('Phaser detected an instance of this game already running, aborting');
                    return;
                }
            }

            this.id = Phaser.GAMES.push(this) - 1;

            this.callbackContext = callbackContext;
            this.onPreloadCallback = preloadCallback;
            this.onCreateCallback = createCallback;
            this.onUpdateCallback = updateCallback;
            this.onRenderCallback = renderCallback;
            this.onDestroyCallback = destroyCallback;

            if (document.readyState === 'complete' || document.readyState === 'interactive')
            {
                setTimeout(() => Phaser.GAMES[this.id].boot(parent, width, height));
            }
            else
            {
                document.addEventListener('DOMContentLoaded', Phaser.GAMES[this.id].boot(parent, width, height), false);
                window.addEventListener('load', Phaser.GAMES[this.id].boot(parent, width, height), false);
            }

        }

        public id: number;

        /**
         * Game loop trigger wrapper.
         */
        public _raf: Phaser.RequestAnimationFrame;

        /**
         * Whether load complete loading or not.
         * @type {bool}
         */
        private _loadComplete: bool = false;

        /**
         * Game is paused?
         * @type {bool}
         */
        private _paused: bool = false;

        /**
         * The state to be switched to in the next frame.
         * @type {State}
         */
        private _pendingState = null;

        /**
         * The PluginManager for the Game
         * @type {PluginManager}
         */
        public plugins: Phaser.PluginManager;

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
        public onPreloadCallback = null;

        /**
         * This will be called when create states. (setup states...)
         * @type {function}
         */
        public onCreateCallback = null;

        /**
         * This will be called when State is updated, this doesn't happen during load (see onLoadUpdateCallback)
         * @type {function}
         */
        public onUpdateCallback = null;

        /**
         * This will be called when the State is rendered, this doesn't happen during load (see onLoadRenderCallback)
         * @type {function}
         */
        public onRenderCallback = null;

        /**
         * This will be called before the State is rendered and before the stage is cleared
         * @type {function}
         */
        public onPreRenderCallback = null;

        /**
         * This will be called when the State is updated but only during the load process
         * @type {function}
         */
        public onLoadUpdateCallback = null;

        /**
         * This will be called when the State is rendered but only during the load process
         * @type {function}
         */
        public onLoadRenderCallback = null;

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
         * This Signal is dispatched whenever the game pauses.
         * @type {Phaser.Signal}
         */
        public onPause: Phaser.Signal;

        /**
         * This Signal is dispatched whenever the game resumes from a paused state.
         * @type {Phaser.Signal}
         */
        public onResume: Phaser.Signal;

        /**
         * Reference to the GameObject Factory.
         * @type {GameObjectFactory}
         */
        public add: Phaser.GameObjectFactory;

        /**
         * Reference to the assets cache.
         * @type {Cache}
         */
        public cache: Phaser.Cache;

        /**
         * Reference to the input manager
         * @type {Input}
         */
        public input: Phaser.InputManager;

        /**
         * Reference to the assets loader.
         * @type {Loader}
         */
        public load: Phaser.Loader;

        /**
         * Reference to the math helper.
         * @type {GameMath}
         */
        public math: Phaser.GameMath;

        /**
         * Reference to the network class.
         * @type {Net}
         */
        public net: Phaser.Net;

        /**
         * Reference to the sound manager.
         * @type {SoundManager}
         */
        public sound: Phaser.SoundManager;

        /**
         * Reference to the stage.
         * @type {Stage}
         */
        public stage: Phaser.Stage;

        /**
         * Reference to game clock.
         * @type {Time}
         */
        public time: Phaser.TimeManager;

        /**
         * Reference to the tween manager.
         * @type {TweenManager}
         */
        public tweens: Phaser.TweenManager;

        /**
         * Reference to the world.
         * @type {World}
         */
        public world: Phaser.World;

        /**
         * Reference to the physics manager.
         * @type {Physics.PhysicsManager}
         */
        public physics: Phaser.Physics.PhysicsManager;

        /**
         * Instance of repeatable random data generator helper.
         * @type {RandomDataGenerator}
         */
        public rnd: Phaser.RandomDataGenerator;

        /**
         * Contains device information and capabilities.
         * @type {Device}
         */
        public device: Phaser.Device;

        /**
         * Reference to the render manager
         * @type {RenderManager}
         */
        public renderer: Phaser.IRenderer;

        /**
         * Whether the game engine is booted, aka available.
         * @type {bool}
         */
        public isBooted: bool = false;

        /**
         * Is game running or paused?
         * @type {bool}
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
                setTimeout(() => Phaser.GAMES[this.id].boot(parent, width, height), 13);
            }
            else
            {
                document.removeEventListener('DOMContentLoaded', Phaser.GAMES[this.id].boot);
                window.removeEventListener('load', Phaser.GAMES[this.id].boot);

                this.onPause = new Phaser.Signal;
                this.onResume = new Phaser.Signal;

                this.device = new Phaser.Device();
                this.net = new Phaser.Net(this);
                this.math = new Phaser.GameMath(this);
                this.stage = new Phaser.Stage(this, parent, width, height);
                this.world = new Phaser.World(this, width, height);
                this.add = new Phaser.GameObjectFactory(this);
                this.cache = new Phaser.Cache(this);
                this.load = new Phaser.Loader(this);
                this.time = new Phaser.TimeManager(this);
                this.tweens = new Phaser.TweenManager(this);
                this.input = new Phaser.InputManager(this);
                this.sound = new Phaser.SoundManager(this);
                this.rnd = new Phaser.RandomDataGenerator([(Date.now() * Math.random()).toString()]);
                this.physics = new Phaser.Physics.PhysicsManager(this);
                this.plugins = new Phaser.PluginManager(this, this);

                this.load.onLoadComplete.add(this.loadComplete, this);

                this.setRenderer(Phaser.Types.RENDERER_CANVAS);

                this.world.boot();
                this.stage.boot();
                this.input.boot();

                this.isBooted = true;

                //  Set-up some static helper references
                Phaser.DebugUtils.game = this;
                Phaser.ColorUtils.game = this;
                Phaser.DebugUtils.context = this.stage.context;

                //  Display the default game screen?
                if (this.onPreloadCallback == null && this.onCreateCallback == null && this.onUpdateCallback == null && this.onRenderCallback == null && this._pendingState == null)
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

        /**
         * Called when the load has finished after preload was run.
         */
        private loadComplete() {
            this._loadComplete = true;
            this.onCreateCallback.call(this.callbackContext);
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
            this.sound.update();

            if (this.onPausedCallback !== null)
            {
                this.onPausedCallback.call(this.callbackContext);
            }

        }

        /**
          * Game loop method will be called when it's running.
          */
        private loop() {

            this.plugins.preUpdate();

            this.tweens.update();
            this.input.update();
            this.stage.update();
            this.sound.update();
            this.physics.update();
            this.world.update();
            this.plugins.update();

            if (this._loadComplete && this.onUpdateCallback)
            {
                this.onUpdateCallback.call(this.callbackContext);
            }
            else if (this._loadComplete == false && this.onLoadUpdateCallback)
            {
                this.onLoadUpdateCallback.call(this.callbackContext);
            }

            this.world.postUpdate();

            this.plugins.postUpdate();
            this.plugins.preRender();

            if (this._loadComplete && this.onPreRenderCallback)
            {
                this.onPreRenderCallback.call(this.callbackContext);
            }

            this.renderer.render();
            this.plugins.render();

            if (this._loadComplete && this.onRenderCallback)
            {
                this.onRenderCallback.call(this.callbackContext);
            }
            else if (this._loadComplete == false && this.onLoadRenderCallback)
            {
                this.onLoadRenderCallback.call(this.callbackContext);
            }

            this.plugins.postRender();
        }

        /**
         * Start current state.
         */
        private startState() {

            if (this.onPreloadCallback !== null)
            {
                this.load.reset();

                this.onPreloadCallback.call(this.callbackContext);

                //  Is the loader empty?
                if (this.load.queueSize == 0)
                {
                    if (this.onCreateCallback !== null)
                    {
                        this.onCreateCallback.call(this.callbackContext);
                    }

                    this._loadComplete = true;
                }
                else
                {
                    //  Start the loader going as we have something in the queue
                    this.load.onLoadComplete.add(this.loadComplete, this);
                    this.load.start();
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

        public setRenderer(renderer: number) {

            switch (renderer)
            {
                case Phaser.Types.RENDERER_AUTO_DETECT:
                    this.renderer = new Phaser.Renderer.Headless.HeadlessRenderer(this);
                    break;

                case Phaser.Types.RENDERER_AUTO_DETECT:
                case Phaser.Types.RENDERER_CANVAS:
                    this.renderer = new Phaser.Renderer.Canvas.CanvasRenderer(this);
                    break;

                // WebGL coming soon :)
            }

        }

        /**
         * Set the most common state callbacks (init, create, update, render).
         * @param preloadCallback {function} Init callback invoked when init state.
         * @param createCallback {function} Create callback invoked when create state.
         * @param updateCallback {function} Update callback invoked when update state.
         * @param renderCallback {function} Render callback invoked when render state.
         * @param destroyCallback {function} Destroy callback invoked when state is destroyed.
         */
        public setCallbacks(preloadCallback = null, createCallback = null, updateCallback = null, renderCallback = null, destroyCallback = null) {

            this.onPreloadCallback = preloadCallback;
            this.onCreateCallback = createCallback;
            this.onUpdateCallback = updateCallback;
            this.onRenderCallback = renderCallback;
            this.onDestroyCallback = destroyCallback;

        }

        /**
         * Switch to a new State.
         * @param state {State} The state you want to switch to.
         * @param [clearWorld] {bool} clear everything in the world? (Default to true)
         * @param [clearCache] {bool} clear asset cache? (Default to false and ONLY available when clearWorld=true)
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
            else
            {
                this.state = state;
            }

            //  Ok, have we got the right functions?
            if (this.state['create'] || this.state['update'])
            {
                this.callbackContext = this.state;

                this.onPreloadCallback = null;
                this.onLoadRenderCallback = null;
                this.onLoadUpdateCallback = null;
                this.onCreateCallback = null;
                this.onUpdateCallback = null;
                this.onRenderCallback = null;
                this.onPreRenderCallback = null;
                this.onPausedCallback = null;
                this.onDestroyCallback = null;

                //  Bingo, let's set them up
                if (this.state['preload'])
                {
                    this.onPreloadCallback = this.state['preload'];
                }

                if (this.state['loadRender'])
                {
                    this.onLoadRenderCallback = this.state['loadRender'];
                }

                if (this.state['loadUpdate'])
                {
                    this.onLoadUpdateCallback = this.state['loadUpdate'];
                }

                if (this.state['create'])
                {
                    this.onCreateCallback = this.state['create'];
                }

                if (this.state['update'])
                {
                    this.onUpdateCallback = this.state['update'];
                }

                if (this.state['preRender'])
                {
                    this.onPreRenderCallback = this.state['preRender'];
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
            this.onPreloadCallback = null;
            this.onLoadRenderCallback = null;
            this.onLoadUpdateCallback = null;
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
                this.onPause.dispatch();
                this.sound.pauseAll();
                this._raf.callback = this.pausedLoop;
            }
            else if (value == false && this._paused == true)
            {
                this._paused = false;
                this.onResume.dispatch();
                this.input.reset();
                this.sound.resumeAll();

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

        public get camera(): Phaser.Camera {
            return this.world.cameras.current;
        }

    }

}