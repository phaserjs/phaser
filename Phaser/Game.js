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
var Phaser;
(function (Phaser) {
    var Game = (function () {
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
        function Game(callbackContext, parent, width, height, preloadCallback, createCallback, updateCallback, renderCallback, destroyCallback) {
            if (typeof parent === "undefined") { parent = ''; }
            if (typeof width === "undefined") { width = 800; }
            if (typeof height === "undefined") { height = 600; }
            if (typeof preloadCallback === "undefined") { preloadCallback = null; }
            if (typeof createCallback === "undefined") { createCallback = null; }
            if (typeof updateCallback === "undefined") { updateCallback = null; }
            if (typeof renderCallback === "undefined") { renderCallback = null; }
            if (typeof destroyCallback === "undefined") { destroyCallback = null; }
            var _this = this;
            /**
            * Whether load complete loading or not.
            * @type {boolean}
            */
            this._loadComplete = false;
            /**
            * Game is paused?
            * @type {boolean}
            */
            this._paused = false;
            /**
            * The state to be switched to in the next frame.
            * @type {State}
            */
            this._pendingState = null;
            /**
            * The current State object (defaults to null)
            * @type {State}
            */
            this.state = null;
            /**
            * This will be called when init states. (loading assets...)
            * @type {function}
            */
            this.onPreloadCallback = null;
            /**
            * This will be called when create states. (setup states...)
            * @type {function}
            */
            this.onCreateCallback = null;
            /**
            * This will be called when State is updated, this doesn't happen during load (see onLoadUpdateCallback)
            * @type {function}
            */
            this.onUpdateCallback = null;
            /**
            * This will be called when the State is rendered, this doesn't happen during load (see onLoadRenderCallback)
            * @type {function}
            */
            this.onRenderCallback = null;
            /**
            * This will be called before the State is rendered and before the stage is cleared
            * @type {function}
            */
            this.onPreRenderCallback = null;
            /**
            * This will be called when the State is updated but only during the load process
            * @type {function}
            */
            this.onLoadUpdateCallback = null;
            /**
            * This will be called when the State is rendered but only during the load process
            * @type {function}
            */
            this.onLoadRenderCallback = null;
            /**
            * This will be called when states paused.
            * @type {function}
            */
            this.onPausedCallback = null;
            /**
            * This will be called when the state is destroyed (i.e. swapping to a new state)
            * @type {function}
            */
            this.onDestroyCallback = null;
            /**
            * Whether the game engine is booted, aka available.
            * @type {boolean}
            */
            this.isBooted = false;
            /**
            * Is game running or paused?
            * @type {boolean}
            */
            this.isRunning = false;
            this.id = Phaser.GAMES.push(this) - 1;

            this.callbackContext = callbackContext;
            this.onPreloadCallback = preloadCallback;
            this.onCreateCallback = createCallback;
            this.onUpdateCallback = updateCallback;
            this.onRenderCallback = renderCallback;
            this.onDestroyCallback = destroyCallback;

            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                setTimeout(function () {
                    return Phaser.GAMES[_this.id].boot(parent, width, height);
                });
            } else {
                document.addEventListener('DOMContentLoaded', Phaser.GAMES[this.id].boot(parent, width, height), false);
                window.addEventListener('load', Phaser.GAMES[this.id].boot(parent, width, height), false);
            }
        }
        /**
        * Initialize engine sub modules and start the game.
        * @param parent {string} ID of parent Dom element.
        * @param width {number} Width of the game screen.
        * @param height {number} Height of the game screen.
        */
        Game.prototype.boot = function (parent, width, height) {
            var _this = this;
            if (this.isBooted == true) {
                return;
            }

            if (!document.body) {
                setTimeout(function () {
                    return Phaser.GAMES[_this.id].boot(parent, width, height);
                }, 13);
            } else {
                document.removeEventListener('DOMContentLoaded', Phaser.GAMES[this.id].boot);
                window.removeEventListener('load', Phaser.GAMES[this.id].boot);

                this.onPause = new Phaser.Signal();
                this.onResume = new Phaser.Signal();

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

                //this.physics = new Phaser.Physics.Manager(this);
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

                if (this.onPreloadCallback == null && this.onCreateCallback == null && this.onUpdateCallback == null && this.onRenderCallback == null && this._pendingState == null) {
                    this._raf = new Phaser.RequestAnimationFrame(this, this.bootLoop);
                } else {
                    this.isRunning = true;
                    this._loadComplete = false;

                    this._raf = new Phaser.RequestAnimationFrame(this, this.loop);

                    if (this._pendingState) {
                        this.switchState(this._pendingState, false, false);
                    } else {
                        this.startState();
                    }
                }
            }
        };

        /**
        * Called when the load has finished after preload was run.
        */
        Game.prototype.loadComplete = function () {
            this._loadComplete = true;
            this.onCreateCallback.call(this.callbackContext);
        };

        /**
        * The bootLoop is called while the game is still booting (waiting for the DOM and resources to be available)
        */
        Game.prototype.bootLoop = function () {
            this.tweens.update();
            this.input.update();
            this.stage.update();
        };

        /**
        * The pausedLoop is called when the game is paused.
        */
        Game.prototype.pausedLoop = function () {
            this.tweens.update();
            this.input.update();
            this.stage.update();
            this.sound.update();

            if (this.onPausedCallback !== null) {
                this.onPausedCallback.call(this.callbackContext);
            }
        };

        Game.prototype.emptyCallback = function () {
            //   Called by onUpdateCallback etc
        };

        /**
        * Game loop method will be called when it's running.
        */
        Game.prototype.loop = function () {
            this.plugins.preUpdate();

            this.tweens.update();
            this.input.update();
            this.stage.update();
            this.sound.update();

            //this.physics.update();
            this.world.update();
            this.plugins.update();

            if (this._loadComplete && this.onUpdateCallback) {
                this.onUpdateCallback.call(this.callbackContext);
            } else if (this._loadComplete == false && this.onLoadUpdateCallback) {
                this.onLoadUpdateCallback.call(this.callbackContext);
            }

            this.world.postUpdate();

            this.plugins.postUpdate();
            this.plugins.preRender();

            if (this._loadComplete && this.onPreRenderCallback) {
                this.onPreRenderCallback.call(this.callbackContext);
            }

            this.renderer.render();
            this.plugins.render();

            if (this._loadComplete && this.onRenderCallback) {
                this.onRenderCallback.call(this.callbackContext);
            } else if (this._loadComplete == false && this.onLoadRenderCallback) {
                this.onLoadRenderCallback.call(this.callbackContext);
            }

            this.plugins.postRender();
        };

        /**
        * Start current state.
        */
        Game.prototype.startState = function () {
            if (this.onPreloadCallback !== null) {
                this.load.reset();

                this.onPreloadCallback.call(this.callbackContext);

                if (this.load.queueSize == 0) {
                    if (this.onCreateCallback !== null) {
                        this.onCreateCallback.call(this.callbackContext);
                    }

                    this._loadComplete = true;
                } else {
                    //  Start the loader going as we have something in the queue
                    this.load.onLoadComplete.add(this.loadComplete, this);
                    this.load.start();
                }
            } else {
                if (this.onCreateCallback !== null) {
                    this.onCreateCallback.call(this.callbackContext);
                }

                this._loadComplete = true;
            }
        };

        Game.prototype.setRenderer = function (renderer) {
            switch (renderer) {
                case Phaser.Types.RENDERER_AUTO_DETECT:
                    this.renderer = new Phaser.Renderer.Headless.HeadlessRenderer(this);
                    break;

                case Phaser.Types.RENDERER_AUTO_DETECT:
                case Phaser.Types.RENDERER_CANVAS:
                    this.renderer = new Phaser.Renderer.Canvas.CanvasRenderer(this);
                    break;
            }
        };

        /**
        * Set the most common state callbacks (init, create, update, render).
        * @param preloadCallback {function} Init callback invoked when init state.
        * @param createCallback {function} Create callback invoked when create state.
        * @param updateCallback {function} Update callback invoked when update state.
        * @param renderCallback {function} Render callback invoked when render state.
        * @param destroyCallback {function} Destroy callback invoked when state is destroyed.
        */
        Game.prototype.setCallbacks = function (preloadCallback, createCallback, updateCallback, renderCallback, destroyCallback) {
            if (typeof preloadCallback === "undefined") { preloadCallback = null; }
            if (typeof createCallback === "undefined") { createCallback = null; }
            if (typeof updateCallback === "undefined") { updateCallback = null; }
            if (typeof renderCallback === "undefined") { renderCallback = null; }
            if (typeof destroyCallback === "undefined") { destroyCallback = null; }
            this.onPreloadCallback = preloadCallback;
            this.onCreateCallback = createCallback;
            this.onUpdateCallback = updateCallback;
            this.onRenderCallback = renderCallback;
            this.onDestroyCallback = destroyCallback;
        };

        /**
        * Switch to a new State.
        * @param state {State} The state you want to switch to.
        * @param [clearWorld] {boolean} clear everything in the world? (Default to true)
        * @param [clearCache] {boolean} clear asset cache? (Default to false and ONLY available when clearWorld=true)
        */
        Game.prototype.switchState = function (state, clearWorld, clearCache) {
            if (typeof clearWorld === "undefined") { clearWorld = true; }
            if (typeof clearCache === "undefined") { clearCache = false; }
            if (this.isBooted == false) {
                this._pendingState = state;
                return;
            }

            if (this.onDestroyCallback !== null) {
                this.onDestroyCallback.call(this.callbackContext);
            }

            this.input.reset(true);

            if (typeof state === 'function') {
                this.state = new state(this);
            }

            if (this.state['create'] || this.state['update']) {
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

                if (this.state['preload']) {
                    this.onPreloadCallback = this.state['preload'];
                }

                if (this.state['loadRender']) {
                    this.onLoadRenderCallback = this.state['loadRender'];
                }

                if (this.state['loadUpdate']) {
                    this.onLoadUpdateCallback = this.state['loadUpdate'];
                }

                if (this.state['create']) {
                    this.onCreateCallback = this.state['create'];
                }

                if (this.state['update']) {
                    this.onUpdateCallback = this.state['update'];
                }

                if (this.state['preRender']) {
                    this.onPreRenderCallback = this.state['preRender'];
                }

                if (this.state['render']) {
                    this.onRenderCallback = this.state['render'];
                }

                if (this.state['paused']) {
                    this.onPausedCallback = this.state['paused'];
                }

                if (this.state['destroy']) {
                    this.onDestroyCallback = this.state['destroy'];
                }

                if (clearWorld) {
                    this.world.destroy();

                    if (clearCache == true) {
                        this.cache.destroy();
                    }
                }

                this._loadComplete = false;

                this.startState();
            } else {
                throw new Error("Invalid State object given. Must contain at least a create or update function.");
            }
        };

        /**
        * Nuke the entire game from orbit
        */
        Game.prototype.destroy = function () {
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
        };

        Object.defineProperty(Game.prototype, "paused", {
            get: function () {
                return this._paused;
            },
            set: function (value) {
                if (value == true && this._paused == false) {
                    this._paused = true;
                    this.onPause.dispatch();
                    this.sound.pauseAll();
                    this._raf.callback = this.pausedLoop;
                } else if (value == false && this._paused == true) {
                    this._paused = false;
                    this.onResume.dispatch();
                    this.input.reset();
                    this.sound.resumeAll();

                    if (this.isRunning == false) {
                        this._raf.callback = this.bootLoop;
                    } else {
                        this._raf.callback = this.loop;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Game.prototype, "camera", {
            get: function () {
                return this.world.cameras.current;
            },
            enumerable: true,
            configurable: true
        });
        return Game;
    })();
    Phaser.Game = Game;
})(Phaser || (Phaser = {}));
