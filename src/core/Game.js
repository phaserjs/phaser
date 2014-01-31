/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Game constructor
*
* Instantiate a new <code>Phaser.Game</code> object.
* @class Phaser.Game
* @classdesc This is where the magic happens. The Game object is the heart of your game,
* providing quick access to common functions and handling the boot process.
* "Hell, there are no rules here - we're trying to accomplish something."
*                                                       Thomas A. Edison
* @constructor
* @param {number} [width=800] - The width of your game in game pixels.
* @param {number} [height=600] - The height of your game in game pixels.
* @param {number} [renderer=Phaser.AUTO] - Which renderer to use: Phaser.AUTO will auto-detect, Phaser.WEBGL, Phaser.CANVAS or Phaser.HEADLESS (no rendering at all).
* @param {string|HTMLElement} [parent=''] - The DOM element into which this games canvas will be injected. Either a DOM ID (string) or the element itself.
* @param {object} [state=null] - The default state object. A object consisting of Phaser.State functions (preload, create, update, render) or null.
* @param {boolean} [transparent=false] - Use a transparent canvas background or not.
* @param  {boolean} [antialias=true] - Anti-alias graphics.
*/
Phaser.Game = function (width, height, renderer, parent, state, transparent, antialias) {

    /**
    * @property {number} id - Phaser Game ID (for when Pixi supports multiple instances).
    */
    this.id = Phaser.GAMES.push(this) - 1;

    /**
    * @property {object} config - The Phaser.Game configuration object.
    */
    this.config = null;

    /**
    * @property {HTMLElement} parent - The Games DOM parent.
    * @default
    */
    this.parent = '';

    /**
    * @property {number} width - The Game width (in pixels).
    * @default
    */
    this.width = 800;

    /**
    * @property {number} height - The Game height (in pixels).
    * @default
    */
    this.height = 600;

    /**
    * @property {boolean} transparent - Use a transparent canvas background or not.
    * @default
    */
    this.transparent = false;

    /**
    * @property {boolean} antialias - Anti-alias graphics (in WebGL this helps with edges, in Canvas2D it retains pixel-art quality).
    * @default
    */
    this.antialias = true;

    /**
    * @property {number} renderer - The Pixi Renderer
    * @default
    */
    this.renderer = Phaser.AUTO;

    /**
    * @property {number} renderType - The Renderer this Phaser.Game will use. Either Phaser.RENDERER_AUTO, Phaser.RENDERER_CANVAS or Phaser.RENDERER_WEBGL.
    */
    this.renderType = Phaser.AUTO;

    /**
    * @property {number} state - The StateManager.
    */
    this.state = null;

    /**
    * @property {boolean} _paused - Is game paused?
    * @private
    * @default
    */
    this._paused = false;

    /**
    * @property {boolean} _loadComplete - Whether load complete loading or not.
    * @private
    * @default
    */
    this._loadComplete = false;

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
    * @default
    */
    this.raf = null;

    /**
    * @property {Phaser.GameObjectFactory} add - Reference to the GameObject Factory.
    * @default
    */
    this.add = null;

    /**
    * @property {Phaser.Cache} cache - Reference to the assets cache.
    * @default
    */
    this.cache = null;

    /**
    * @property {Phaser.Input} input - Reference to the input manager
    * @default
    */
    this.input = null;

    /**
    * @property {Phaser.Loader} load - Reference to the assets loader.
    * @default
    */
    this.load = null;

    /**
    * @property {Phaser.Math} math - Reference to the math helper.
    * @default
    */
    this.math = null;

    /**
    * @property {Phaser.Net} net - Reference to the network class.
    * @default
    */
    this.net = null;

    /**
    * @property {Phaser.SoundManager} sound - Reference to the sound manager.
    * @default
    */
    this.sound = null;

    /**
    * @property {Phaser.Stage} stage - Reference to the stage.
    * @default
    */
    this.stage = null;

    /**
    * @property {Phaser.TimeManager} time - Reference to game clock.
    * @default
    */
    this.time = null;

    /**
    * @property {Phaser.TweenManager} tweens - Reference to the tween manager.
    * @default
    */
    this.tweens = null;

    /**
    * @property {Phaser.World} world - Reference to the world.
    * @default
    */
    this.world = null;

    /**
    * @property {Phaser.Physics.PhysicsManager} physics - Reference to the physics manager.
    * @default
    */
    this.physics = null;

    /**
    * @property {Phaser.RandomDataGenerator} rnd - Instance of repeatable random data generator helper.
    * @default
    */
    this.rnd = null;

    /**
    * @property {Phaser.Device} device - Contains device information and capabilities.
    * @default
    */
    this.device = null;

    /**
    * @property {Phaser.Physics.PhysicsManager} camera - A handy reference to world.camera.
    * @default
    */
    this.camera = null;

       /**
    * @property {HTMLCanvasElement} canvas - A handy reference to renderer.view.
    * @default
    */
    this.canvas = null;

    /**
    * @property {Context} context - A handy reference to renderer.context (only set for CANVAS games)
    * @default
    */
    this.context = null;

    /**
    * @property {Phaser.Utils.Debug} debug - A set of useful debug utilitie.
    * @default
    */
    this.debug = null;

    /**
    * @property {Phaser.Particles} particles - The Particle Manager.
    * @default
    */
    this.particles = null;

    //  Parse the configuration object (if any)
    if (arguments.length === 1 && typeof arguments[0] === 'object')
    {
        this.parseConfig(arguments[0]);
    }
    else
    {
        if (typeof width !== 'undefined')
        {
            this.width = width;
        }

        if (typeof height !== 'undefined')
        {
            this.height = height;
        }

        if (typeof renderer !== 'undefined')
        {
            this.renderer = renderer;
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

        this.state = new Phaser.StateManager(this, state);
    }

    var _this = this;

    this._onBoot = function () {
        return _this.boot();
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive')
    {
        window.setTimeout(this._onBoot, 0);
    }
    else
    {
        document.addEventListener('DOMContentLoaded', this._onBoot, false);
        window.addEventListener('load', this._onBoot, false);
    }

    this.pendingStep = false;
    this.stepping = false;
    this.stepCount = 0;

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

        if (config['width'])
        {
            this.width = this.parseDimension(config['width'], 0);
        }

        if (config['height'])
        {
            this.height = this.parseDimension(config['height'], 1);
        }

        if (config['renderer'])
        {
            this.renderer = config['renderer'];
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

        var state = null;

        if (config['state'])
        {
            state = config['state'];
        }

        this.state = new Phaser.StateManager(this, state);

    },

    /**
    * Get dimension.
    *
    * @method Phaser.Game#parseDimension
    * @protected
    */
    parseDimension: function (size, dimension) {

        var f = 0;
        var px = 0;

        if (typeof size === 'string')
        {
            //  %?
            if (size.substr(-1) === '%')
            {
                f = parseInt(size, 10) / 100;

                if (dimension === 0)
                {
                    px = window.innerWidth * f;
                }
                else
                {
                    px = window.innerHeight * f;
                }
            }
            else
            {
                px = parseInt(size, 10);
            }
        }
        else
        {
            px = size;
        }

        return px;

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

            this.isBooted = true;

            this.device = new Phaser.Device();
            this.math = Phaser.Math;
            this.rnd = new Phaser.RandomDataGenerator([(Date.now() * Math.random()).toString()]);

            this.stage = new Phaser.Stage(this, this.width, this.height);

            this.setUpRenderer();

            this.world = new Phaser.World(this);
            this.add = new Phaser.GameObjectFactory(this);
            this.cache = new Phaser.Cache(this);
            this.load = new Phaser.Loader(this);
            this.time = new Phaser.Time(this);
            this.tweens = new Phaser.TweenManager(this);
            this.input = new Phaser.Input(this);
            this.sound = new Phaser.SoundManager(this);
            this.physics = new Phaser.Physics.Arcade(this);
            this.particles = new Phaser.Particles(this);
            this.plugins = new Phaser.PluginManager(this, this);
            this.net = new Phaser.Net(this);
            this.debug = new Phaser.Utils.Debug(this);

            this.time.boot();
            this.stage.boot();
            this.world.boot();
            this.input.boot();
            this.sound.boot();
            this.state.boot();

            this.load.onLoadComplete.add(this.loadComplete, this);

            this.showDebugHeader();

            this.isRunning = true;
            this._loadComplete = false;

            this.raf = new Phaser.RequestAnimationFrame(this);
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

        var v = Phaser.DEV_VERSION;
        var r = 'Canvas';
        var a = 'HTML Audio';

        if (this.renderType == Phaser.WEBGL)
        {
            r = 'WebGL';
        }
        else if (this.renderType == Phaser.HEADLESS)
        {
            r = 'Headless';
        }

        if (this.device.webAudio)
        {
            a = 'WebAudio';
        }

        if (this.device.chrome)
        {
            var args = [
                '%c %c %c  Phaser v' + v + ' - Renderer: ' + r + ' - Audio: ' + a + '  %c %c ',
                'background: #00bff3',
                'background: #0072bc',
                'color: #ffffff; background: #003471',
                'background: #0072bc',
                'background: #00bff3'
            ];

            console.log.apply(console, args);
        }
        else
        {
            console.log('Phaser v' + v + ' - Renderer: ' + r + ' - Audio: ' + a);
        }

    },

    /**
    * Checks if the device is capable of using the requested renderer and sets it up or an alternative if not.
    *
    * @method Phaser.Game#setUpRenderer
    * @protected
    */
    setUpRenderer: function () {

        /*
        if (this.device.trident)
        {
            //  Pixi WebGL renderer on IE11 doesn't work correctly with masks, if you need them you may want to comment this block out
            this.renderType = Phaser.CANVAS;
        }
        */

        if (this.renderType === Phaser.HEADLESS || this.renderType === Phaser.CANVAS || (this.renderType === Phaser.AUTO && this.device.webGL === false))
        {
            if (this.device.canvas)
            {
                if (this.renderType === Phaser.AUTO)
                {
                    this.renderType = Phaser.CANVAS;
                }

                this.renderer = new PIXI.CanvasRenderer(this.width, this.height, this.stage.canvas, this.transparent);
                Phaser.Canvas.setSmoothingEnabled(this.renderer.context, this.antialias);
                this.canvas = this.renderer.view;
                this.context = this.renderer.context;
            }
            else
            {
                throw new Error('Phaser.Game - cannot create Canvas or WebGL context, aborting.');
            }
        }
        else
        {
            //  They requested WebGL, and their browser supports it
            this.renderType = Phaser.WEBGL;
            this.renderer = new PIXI.WebGLRenderer(this.width, this.height, this.stage.canvas, this.transparent, this.antialias);
            this.canvas = this.renderer.view;
            this.context = null;
        }

        Phaser.Canvas.addToDOM(this.renderer.view, this.parent, true);
        Phaser.Canvas.setTouchAction(this.renderer.view);

    },

    /**
    * Called when the load has finished, after preload was run.
    *
    * @method Phaser.Game#loadComplete
    * @protected
    */
    loadComplete: function () {

        this._loadComplete = true;

        this.state.loadComplete();

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

        if (this._paused)
        {
            this.renderer.render(this.stage._stage);
            this.plugins.render();
            this.state.render();
        }
        else
        {
            if (!this.pendingStep)
            {
                if (this.stepping)
                {
                    this.pendingStep = true;
                }

                this.plugins.preUpdate();
        console.log('world preUpdate');
                this.world.preUpdate();

                this.stage.update();
                this.input.update();
                this.tweens.update();
                this.sound.update();
        // console.log('state update');
                this.state.update();
        // console.log('world update');
                this.world.update();
                this.particles.update();            
                this.plugins.update();

        console.log('world postUpdate');
                this.world.postUpdate();
                this.plugins.postUpdate();
            }

            if (this.renderType !== Phaser.HEADLESS)
            {
                this.renderer.render(this.stage._stage);
                this.plugins.render();
                this.state.render();

                this.plugins.postRender();
            }
        }

    },

    enableStep: function () {

        this.stepping = true;
        this.pendingStep = false;
        this.stepCount = 0;

    },

    step: function () {

        this.pendingStep = false;
        this.stepCount++;
        console.log('');
        console.log('----------------------------- Game step', this.stepCount);

    },

    /**
    * Nuke the entire game from orbit
    *
    * @method Phaser.Game#destroy
    */
    destroy: function () {

        this.raf.stop();

        this.input.destroy();

        this.state.destroy();

        this.state = null;
        this.cache = null;
        this.input = null;
        this.load = null;
        this.sound = null;
        this.stage = null;
        this.time = null;
        this.world = null;
        this.isBooted = false;

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
                this.onPause.dispatch(this);
            }
        }
        else
        {
            if (this._paused)
            {
                this._paused = false;
                this.onResume.dispatch(this);
            }
        }

    }

});

/**
* "Deleted code is debugged code." - Jeff Sickel
*/
