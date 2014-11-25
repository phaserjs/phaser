/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* This is where the magic happens. The Game object is the heart of your game,
* providing quick access to common functions and handling the boot process.
* "Hell, there are no rules here - we're trying to accomplish something."
*                                                       Thomas A. Edison
*
* @class Phaser.Game
* @constructor
* @param {number|string} [width=800] - The width of your game in game pixels. If given as a string the value must be between 0 and 100 and will be used as the percentage width of the parent container, or the browser window if no parent is given.
* @param {number|string} [height=600] - The height of your game in game pixels. If given as a string the value must be between 0 and 100 and will be used as the percentage height of the parent container, or the browser window if no parent is given.
* @param {number} [renderer=Phaser.AUTO] - Which renderer to use: Phaser.AUTO will auto-detect, Phaser.WEBGL, Phaser.CANVAS or Phaser.HEADLESS (no rendering at all).
* @param {string|HTMLElement} [parent=''] - The DOM element into which this games canvas will be injected. Either a DOM ID (string) or the element itself.
* @param {object} [state=null] - The default state object. A object consisting of Phaser.State functions (preload, create, update, render) or null.
* @param {boolean} [transparent=false] - Use a transparent canvas background or not.
* @param {boolean} [antialias=true] - Draw all image textures anti-aliased or not. The default is for smooth textures, but disable if your game features pixel art.
* @param {object} [physicsConfig=null] - A physics configuration object to pass to the Physics world on creation.
*/
Phaser.Game = function (width, height, renderer, parent, state, transparent, antialias, physicsConfig) {

    /**
    * @property {number} id - Phaser Game ID (for when Pixi supports multiple instances).
    */
    this.id = Phaser.GAMES.push(this) - 1;

    /**
    * @property {object} config - The Phaser.Game configuration object.
    */
    this.config = null;

    /**
    * @property {object} physicsConfig - The Phaser.Physics.World configuration object.
    */
    this.physicsConfig = physicsConfig;

    /**
    * @property {string|HTMLElement} parent - The Games DOM parent.
    * @default
    */
    this.parent = '';

    /**
    * @property {number} width - The calculated game width in pixels.
    * @default
    */
    this.width = 800;

    /**
    * @property {number} height - The calculated game height in pixels.
    * @default
    */
    this.height = 600;

    /**
    * @property {boolean} transparent - Use a transparent canvas background or not.
    * @default
    */
    this.transparent = false;

    /**
    * @property {boolean} antialias - Anti-alias graphics. By default scaled images are smoothed in Canvas and WebGL, set anti-alias to false to disable this globally.
    * @default
    */
    this.antialias = true;

    /**
    * @property {boolean} preserveDrawingBuffer - The value of the preserveDrawingBuffer flag affects whether or not the contents of the stencil buffer is retained after rendering.
    * @default
    */
    this.preserveDrawingBuffer = false;

    /**
    * @property {PIXI.CanvasRenderer|PIXI.WebGLRenderer} renderer - The Pixi Renderer.
    */
    this.renderer = null;

    /**
    * @property {number} renderType - The Renderer this game will use. Either Phaser.AUTO, Phaser.CANVAS or Phaser.WEBGL.
    */
    this.renderType = Phaser.AUTO;

    /**
    * @property {Phaser.StateManager} state - The StateManager.
    */
    this.state = null;

    /**
    * @property {boolean} isBooted - Whether the game engine is booted, aka available.
    * @default
    */
    this.isBooted = false;

    /**
    * @property {boolean} id -Is game running or paused?
    * @default
    */
    this.isRunning = false;

    /**
    * @property {Phaser.RequestAnimationFrame} raf - Automatically handles the core game loop via requestAnimationFrame or setTimeout
    */
    this.raf = null;

    /**
    * @property {Phaser.GameObjectFactory} add - Reference to the Phaser.GameObjectFactory.
    */
    this.add = null;

    /**
    * @property {Phaser.GameObjectCreator} make - Reference to the GameObject Creator.
    */
    this.make = null;

    /**
    * @property {Phaser.Cache} cache - Reference to the assets cache.
    */
    this.cache = null;

    /**
    * @property {Phaser.Input} input - Reference to the input manager
    */
    this.input = null;

    /**
    * @property {Phaser.Loader} load - Reference to the assets loader.
    */
    this.load = null;

    /**
    * @property {Phaser.Math} math - Reference to the math helper.
    */
    this.math = null;

    /**
    * @property {Phaser.Net} net - Reference to the network class.
    */
    this.net = null;

    /**
    * @property {Phaser.ScaleManager} scale - The game scale manager.
    */
    this.scale = null;

    /**
    * @property {Phaser.SoundManager} sound - Reference to the sound manager.
    */
    this.sound = null;

    /**
    * @property {Phaser.Stage} stage - Reference to the stage.
    */
    this.stage = null;

    /**
    * @property {Phaser.Time} time - Reference to the core game clock.
    */
    this.time = null;

    /**
    * @property {Phaser.TweenManager} tweens - Reference to the tween manager.
    */
    this.tweens = null;

    /**
    * @property {Phaser.World} world - Reference to the world.
    */
    this.world = null;

    /**
    * @property {Phaser.Physics} physics - Reference to the physics manager.
    */
    this.physics = null;

    /**
    * @property {Phaser.RandomDataGenerator} rnd - Instance of repeatable random data generator helper.
    */
    this.rnd = null;

    /**
    * @property {Phaser.Device} device - Contains device information and capabilities.
    */
    this.device = null;

    /**
    * @property {Phaser.Camera} camera - A handy reference to world.camera.
    */
    this.camera = null;

    /**
    * @property {HTMLCanvasElement} canvas - A handy reference to renderer.view, the canvas that the game is being rendered in to.
    */
    this.canvas = null;

    /**
    * @property {CanvasRenderingContext2D} context - A handy reference to renderer.context (only set for CANVAS games, not WebGL)
    */
    this.context = null;

    /**
    * @property {Phaser.Utils.Debug} debug - A set of useful debug utilitie.
    */
    this.debug = null;

    /**
    * @property {Phaser.Particles} particles - The Particle Manager.
    */
    this.particles = null;

    /**
    * @property {boolean} stepping - Enable core loop stepping with Game.enableStep().
    * @default
    * @readonly
    */
    this.stepping = false;

    /**
    * @property {boolean} pendingStep - An internal property used by enableStep, but also useful to query from your own game objects.
    * @default
    * @readonly
    */
    this.pendingStep = false;

    /**
    * @property {number} stepCount - When stepping is enabled this contains the current step cycle.
    * @default
    * @readonly
    */
    this.stepCount = 0;

    /**
    * @property {Phaser.Signal} onPause - This event is fired when the game pauses.
    */
    this.onPause = null;

    /**
    * @property {Phaser.Signal} onResume - This event is fired when the game resumes from a paused state.
    */
    this.onResume = null;

    /**
    * @property {Phaser.Signal} onBlur - This event is fired when the game no longer has focus (typically on page hide).
    */
    this.onBlur = null;

    /**
    * @property {Phaser.Signal} onFocus - This event is fired when the game has focus (typically on page show).
    */
    this.onFocus = null;

    /**
    * @property {boolean} _paused - Is game paused?
    * @private
    */
    this._paused = false;

    /**
    * @property {boolean} _codePaused - Was the game paused via code or a visibility change?
    * @private
    */
    this._codePaused = false;

    this._width = 800;
    this._height = 600;

    //  Parse the configuration object (if any)
    if (arguments.length === 1 && typeof arguments[0] === 'object')
    {
        this.parseConfig(arguments[0]);
    }
    else
    {
        this.config = { enableDebug: true };

        if (typeof width !== 'undefined')
        {
            this._width = width;
        }

        if (typeof height !== 'undefined')
        {
            this._height = height;
        }

        if (typeof renderer !== 'undefined')
        {
            this.renderType = renderer;
        }

        if (typeof parent !== 'undefined')
        {
            this.parent = parent;
        }

        if (typeof transparent !== 'undefined')
        {
            this.transparent = transparent;
        }

        if (typeof antialias !== 'undefined')
        {
            this.antialias = antialias;
        }

        this.rnd = new Phaser.RandomDataGenerator([(Date.now() * Math.random()).toString()]);

        this.state = new Phaser.StateManager(this, state);
    }

    var _this = this;

    this._onBoot = function () {
        return _this.boot();
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive')
    {
        window.setTimeout(this._onBoot, 0);
    }
    else if(typeof window.cordova !== "undefined")
    {
        document.addEventListener('deviceready', this._onBoot, false);
    }
    else
    {
        document.addEventListener('DOMContentLoaded', this._onBoot, false);
        window.addEventListener('load', this._onBoot, false);
    }

    return this;

};

Phaser.Game.prototype = {

    /**
    * Parses a Game configuration object.
    *
    * @method Phaser.Game#parseConfig
    * @protected
    */
    parseConfig: function (config) {

        this.config = config;

        if (typeof config['enableDebug'] === 'undefined')
        {
            this.config.enableDebug = true;
        }

        if (config['width'])
        {
            this._width = config['width'];
        }

        if (config['height'])
        {
            this._height = config['height'];
        }

        if (config['renderer'])
        {
            this.renderType = config['renderer'];
        }

        if (config['parent'])
        {
            this.parent = config['parent'];
        }

        if (config['transparent'])
        {
            this.transparent = config['transparent'];
        }

        if (config['antialias'])
        {
            this.antialias = config['antialias'];
        }

        if (config['preserveDrawingBuffer'])
        {
            this.preserveDrawingBuffer = config['preserveDrawingBuffer'];
        }

        if (config['physicsConfig'])
        {
            this.physicsConfig = config['physicsConfig'];
        }

        var seed = [(Date.now() * Math.random()).toString()];

        if (config['seed'])
        {
            seed = config['seed'];
        }

        this.rnd = new Phaser.RandomDataGenerator(seed);

        var state = null;

        if (config['state'])
        {
            state = config['state'];
        }

        this.state = new Phaser.StateManager(this, state);

    },

    /**
    * Initialize engine sub modules and start the game.
    *
    * @method Phaser.Game#boot
    * @protected
    */
    boot: function () {

        if (this.isBooted)
        {
            return;
        }

        if (!document.body)
        {
            window.setTimeout(this._onBoot, 20);
        }
        else
        {
            document.removeEventListener('DOMContentLoaded', this._onBoot);
            window.removeEventListener('load', this._onBoot);

            this.onPause = new Phaser.Signal();
            this.onResume = new Phaser.Signal();
            this.onBlur = new Phaser.Signal();
            this.onFocus = new Phaser.Signal();

            this.isBooted = true;

            this.device = new Phaser.Device(this);

            this.math = Phaser.Math;

            this.scale = new Phaser.ScaleManager(this, this._width, this._height);
            this.stage = new Phaser.Stage(this);

            this.setUpRenderer();

            this.device.checkFullScreenSupport();

            this.world = new Phaser.World(this);
            this.add = new Phaser.GameObjectFactory(this);
            this.make = new Phaser.GameObjectCreator(this);
            this.cache = new Phaser.Cache(this);
            this.load = new Phaser.Loader(this);
            this.time = new Phaser.Time(this);
            this.tweens = new Phaser.TweenManager(this);
            this.input = new Phaser.Input(this);
            this.sound = new Phaser.SoundManager(this);
            this.physics = new Phaser.Physics(this, this.physicsConfig);
            this.particles = new Phaser.Particles(this);
            this.plugins = new Phaser.PluginManager(this);
            this.net = new Phaser.Net(this);

            this.time.boot();
            this.stage.boot();
            this.world.boot();
            this.scale.boot();
            this.input.boot();
            this.sound.boot();
            this.state.boot();

            if (this.config['enableDebug'])
            {
                this.debug = new Phaser.Utils.Debug(this);
                this.debug.boot();
            }

            this.showDebugHeader();

            this.isRunning = true;

            if (this.config && this.config['forceSetTimeOut'])
            {
                this.raf = new Phaser.RequestAnimationFrame(this, this.config['forceSetTimeOut']);
            }
            else
            {
                this.raf = new Phaser.RequestAnimationFrame(this, false);
            }

            this.raf.start();
        }

    },

    /**
    * Displays a Phaser version debug header in the console.
    *
    * @method Phaser.Game#showDebugHeader
    * @protected
    */
    showDebugHeader: function () {

        var v = Phaser.VERSION;
        var r = 'Canvas';
        var a = 'HTML Audio';
        var c = 1;

        if (this.renderType === Phaser.WEBGL)
        {
            r = 'WebGL';
            c++;
        }
        else if (this.renderType == Phaser.HEADLESS)
        {
            r = 'Headless';
        }

        if (this.device.webAudio)
        {
            a = 'WebAudio';
            c++;
        }

        if (this.device.chrome)
        {
            var args = [
                '%c %c %c Phaser v' + v + ' | Pixi.js ' + PIXI.VERSION + ' | ' + r + ' | ' + a + '  %c %c ' + ' http://phaser.io  %c %c \u2665%c\u2665%c\u2665 ',
                'background: #7a66a3',
                'background: #625186',
                'color: #ffffff; background: #43375b;',
                'background: #625186',
                'background: #ccb9f2',
                'background: #625186'
            ];

            for (var i = 0; i < 3; i++)
            {
                if (i < c)
                {
                    args.push('color: #ff2424; background: #fff');
                }
                else
                {
                    args.push('color: #959595; background: #fff');
                }
            }

            console.log.apply(console, args);
        }
        else if (window['console'])
        {
            console.log('Phaser v' + v + ' | Pixi.js ' + PIXI.VERSION + ' | ' + r + ' | ' + a + ' | http://phaser.io');
        }

    },

    /**
    * Checks if the device is capable of using the requested renderer and sets it up or an alternative if not.
    *
    * @method Phaser.Game#setUpRenderer
    * @protected
    */
    setUpRenderer: function () {

        if (this.config['canvasID'])
        {
            this.canvas = Phaser.Canvas.create(this.width, this.height, this.config['canvasID']);
        }
        else
        {
            this.canvas = Phaser.Canvas.create(this.width, this.height);
        }

        if (this.config['canvasStyle'])
        {
            this.canvas.style = this.config['canvasStyle'];
        }
        else
        {
            this.canvas.style['-webkit-full-screen'] = 'width: 100%; height: 100%';
        }

        if (this.device.cocoonJS)
        {
            if (this.renderType === Phaser.CANVAS)
            {
                this.canvas.screencanvas = true;
            }
            else
            {
                // Some issue related to scaling arise with Cocoon using screencanvas and webgl renderer.
                this.canvas.screencanvas = false;
            }
        }

        if (this.renderType === Phaser.HEADLESS || this.renderType === Phaser.CANVAS || (this.renderType === Phaser.AUTO && this.device.webGL === false))
        {
            if (this.device.canvas)
            {
                if (this.renderType === Phaser.AUTO)
                {
                    this.renderType = Phaser.CANVAS;
                }

                this.renderer = new PIXI.CanvasRenderer(this.width, this.height, { "view": this.canvas, "transparent": this.transparent, "resolution": 1, "clearBeforeRender": true });
                this.context = this.renderer.context;
            }
            else
            {
                throw new Error('Phaser.Game - cannot create Canvas or WebGL context, aborting.');
            }
        }
        else
        {
            //  They requested WebGL and their browser supports it
            this.renderType = Phaser.WEBGL;

            this.renderer = new PIXI.WebGLRenderer(this.width, this.height, { "view": this.canvas, "transparent": this.transparent, "resolution": 1, "antialias": this.antialias, "preserveDrawingBuffer": this.preserveDrawingBuffer });
            this.context = null;
        }

        if (this.renderType !== Phaser.HEADLESS)
        {
            this.stage.smoothed = this.antialias;
            
            Phaser.Canvas.addToDOM(this.canvas, this.parent, false);
            Phaser.Canvas.setTouchAction(this.canvas);
        }

    },

    /**
    * The core game loop.
    *
    * @method Phaser.Game#update
    * @protected
    * @param {number} time - The current time as provided by RequestAnimationFrame.
    */
    update: function (time) {

        this.time.update(time);

        if (!this._paused && !this.pendingStep)
        {
            if (this.stepping)
            {
                this.pendingStep = true;
            }

            this.scale.preUpdate();

            if (this.config['enableDebug'])
            {
                this.debug.preUpdate();
            }

            this.physics.preUpdate();
            this.state.preUpdate();
            this.plugins.preUpdate();
            this.stage.preUpdate();

            this.state.update();
            this.stage.update();
            this.tweens.update();
            this.sound.update();
            this.input.update();
            this.physics.update();
            this.particles.update();
            this.plugins.update();

            this.stage.postUpdate();
            this.plugins.postUpdate();
        }
        else
        {
            this.state.pauseUpdate();

            if (this.config['enableDebug'])
            {
                this.debug.preUpdate();
            }
        }

        if (this.renderType != Phaser.HEADLESS)
        {
            this.state.preRender();
            this.renderer.render(this.stage);

            this.plugins.render();
            this.state.render();
            this.plugins.postRender();

            if (this.device.cocoonJS && this.renderType === Phaser.CANVAS && this.stage.currentRenderOrderID === 1)
            {
                //  Horrible hack! But without it Cocoon fails to render a scene with just a single drawImage call on it.
                this.context.fillRect(0, 0, 0, 0);
            }
        }

    },

    /**
    * Enable core game loop stepping. When enabled you must call game.step() directly (perhaps via a DOM button?)
    * Calling step will advance the game loop by one frame. This is extremely useful for hard to track down errors!
    *
    * @method Phaser.Game#enableStep
    */
    enableStep: function () {

        this.stepping = true;
        this.pendingStep = false;
        this.stepCount = 0;

    },

    /**
    * Disables core game loop stepping.
    *
    * @method Phaser.Game#disableStep
    */
    disableStep: function () {

        this.stepping = false;
        this.pendingStep = false;

    },

    /**
    * When stepping is enabled you must call this function directly (perhaps via a DOM button?) to advance the game loop by one frame.
    * This is extremely useful to hard to track down errors! Use the internal stepCount property to monitor progress.
    *
    * @method Phaser.Game#step
    */
    step: function () {

        this.pendingStep = false;
        this.stepCount++;

    },

    /**
    * Nukes the entire game from orbit.
    *
    * @method Phaser.Game#destroy
    */
    destroy: function () {

        this.raf.stop();

        this.state.destroy();
        this.sound.destroy();

        this.scale.destroy();
        this.stage.destroy();
        this.input.destroy();
        this.physics.destroy();

        this.state = null;
        this.cache = null;
        this.input = null;
        this.load = null;
        this.sound = null;
        this.stage = null;
        this.time = null;
        this.world = null;
        this.isBooted = false;

        Phaser.Canvas.removeFromDOM(this.canvas);

    },

    /**
    * Called by the Stage visibility handler.
    *
    * @method Phaser.Game#gamePaused
    * @param {object} event - The DOM event that caused the game to pause, if any.
    * @protected
    */
    gamePaused: function (event) {

        //   If the game is already paused it was done via game code, so don't re-pause it
        if (!this._paused)
        {
            this._paused = true;
            this.time.gamePaused();
            this.sound.setMute();
            this.onPause.dispatch(event);
        }

    },

    /**
    * Called by the Stage visibility handler.
    *
    * @method Phaser.Game#gameResumed
    * @param {object} event - The DOM event that caused the game to pause, if any.
    * @protected
    */
    gameResumed: function (event) {

        //  Game is paused, but wasn't paused via code, so resume it
        if (this._paused && !this._codePaused)
        {
            this._paused = false;
            this.time.gameResumed();
            this.input.reset();
            this.sound.unsetMute();
            this.onResume.dispatch(event);
        }

    },

    /**
    * Called by the Stage visibility handler.
    *
    * @method Phaser.Game#focusLoss
    * @param {object} event - The DOM event that caused the game to pause, if any.
    * @protected
    */
    focusLoss: function (event) {

        this.onBlur.dispatch(event);

        if (!this.stage.disableVisibilityChange)
        {
            this.gamePaused(event);
        }

    },

    /**
    * Called by the Stage visibility handler.
    *
    * @method Phaser.Game#focusGain
    * @param {object} event - The DOM event that caused the game to pause, if any.
    * @protected
    */
    focusGain: function (event) {

        this.onFocus.dispatch(event);

        if (!this.stage.disableVisibilityChange)
        {
            this.gameResumed(event);
        }

    }

};

Phaser.Game.prototype.constructor = Phaser.Game;

/**
* The paused state of the Game. A paused game doesn't update any of its subsystems.
* When a game is paused the onPause event is dispatched. When it is resumed the onResume event is dispatched.
* @name Phaser.Game#paused
* @property {boolean} paused - Gets and sets the paused state of the Game.
*/
Object.defineProperty(Phaser.Game.prototype, "paused", {

    get: function () {
        return this._paused;
    },

    set: function (value) {

        if (value === true)
        {
            if (this._paused === false)
            {
                this._paused = true;
                this.sound.setMute();
                this.time.gamePaused();
                this.onPause.dispatch(this);
            }
            this._codePaused = true;
        }
        else
        {
            if (this._paused)
            {
                this._paused = false;
                this.input.reset();
                this.sound.unsetMute();
                this.time.gameResumed();
                this.onResume.dispatch(this);
            }
            this._codePaused = false;
        }

    }

});

/**
* "Deleted code is debugged code." - Jeff Sickel
*/
