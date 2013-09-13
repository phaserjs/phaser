/**
* Phaser.Game
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

/**
* Game constructor
*
* Instantiate a new <code>Phaser.Game</code> object.
*
* @constructor
* @param width {number} The width of your game in game pixels.
* @param height {number} The height of your game in game pixels.
* @param renderer {number} Which renderer to use (canvas or webgl)
* @param parent {string} ID of its parent DOM element.
*/
Phaser.Game = function (width, height, renderer, parent, state, transparent, antialias) {

	width = width || 800;
	height = height || 600;
	renderer = renderer || Phaser.AUTO;
	parent = parent || '';
	state = state || null;
	transparent = transparent || false;
	antialias = antialias || true;

	/**
	* Phaser Game ID (for when Pixi supports multiple instances)
	* @type {number}
	*/
	this.id = Phaser.GAMES.push(this) - 1;

	/**
	* The Games DOM parent.
	* @type {HTMLElement}
	*/
	this.parent = parent;

	//	Do some more intelligent size parsing here, so they can set "100%" for example, maybe pass the scale mode in here too?

	/**
	* The Game width (in pixels).
	* @type {number}
	*/
	this.width = width;

	/**
	* The Game height (in pixels).
	* @type {number}
	*/
	this.height = height;

	/**
	* Use a transparent canvas background or not.
	* @type {boolean}
	*/
	this.transparent = transparent;

	/**
	* Anti-alias graphics (in WebGL this helps with edges, in Canvas2D it retains pixel-art quality)
	* @type {boolean}
	*/
	this.antialias = antialias;

	/**
	* The Pixi Renderer
	* @type {number}
	*/
	this.renderer = null;

    /**
     * The StateManager.
     * @type {Phaser.StateManager}
     */
	this.state = new Phaser.StateManager(this, state);

	/**
	* Is game paused?
	* @type {bool}
	*/
	this._paused = false;

	/**
	* The Renderer this Phaser.Game will use. Either Phaser.RENDERER_AUTO, Phaser.RENDERER_CANVAS or Phaser.RENDERER_WEBGL
	* @type {number}
	*/
	this.renderType = renderer;

	/**
	* Whether load complete loading or not.
	* @type {bool}
	*/
	this._loadComplete = false;

	/**
	* Whether the game engine is booted, aka available.
	* @type {bool}
	*/
	this.isBooted = false;

	/**
	* Is game running or paused?
	* @type {bool}
	*/
	this.isRunning = false;

	/**
	* Automatically handles the core game loop via requestAnimationFrame or setTimeout
     * @type {Phaser.RequestAnimationFrame}
	*/
	this.raf = null;

    /**
     * Reference to the GameObject Factory.
     * @type {Phaser.GameObjectFactory}
     */
    this.add = null;

    /**
     * Reference to the assets cache.
     * @type {Phaser.Cache}
     */
    this.cache = null;

    /**
     * Reference to the input manager
     * @type {Phaser.Input}
     */
    this.input = null;

    /**
     * Reference to the assets loader.
     * @type {Phaser.Loader}
     */
    this.load = null;

    /**
     * Reference to the math helper.
     * @type {Phaser.GameMath}
     */
    this.math = null;

    /**
     * Reference to the network class.
     * @type {Phaser.Net}
     */
    this.net = null;

    /**
     * Reference to the sound manager.
     * @type {Phaser.SoundManager}
     */
    this.sound = null;

    /**
     * Reference to the stage.
     * @type {Phaser.Stage}
     */
    this.stage = null;

    /**
     * Reference to game clock.
     * @type {Phaser.TimeManager}
     */
    this.time = null;

    /**
     * Reference to the tween manager.
     * @type {Phaser.TweenManager}
     */
    this.tweens = null;

    /**
     * Reference to the world.
     * @type {Phaser.World}
     */
    this.world = null;

    /**
     * Reference to the physics manager.
     * @type {Phaser.Physics.PhysicsManager}
     */
    this.physics = null;

    /**
     * Instance of repeatable random data generator helper.
     * @type {Phaser.RandomDataGenerator}
     */
    this.rnd = null;

    /**
     * Contains device information and capabilities.
     * @type {Phaser.Device}
     */
    this.device = null;

	/**
	* A handy reference to world.camera
	* @type {Phaser.Camera}
	*/
	this.camera = null;

	/**
	* A handy reference to renderer.view
	* @type {HTMLCanvasElement}
	*/
	this.canvas = null;

	/**
	* A handy reference to renderer.context (only set for CANVAS games)
	* @type {Context}
	*/
	this.context = null;

	/**
	* A set of useful debug utilities
	* @type {Phaser.Utils.Debug}
	*/
	this.debug = null;

	/**
	* The Particle Manager
	* @type {Phaser.Particles}
	*/
	this.particles = null;

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

	return this;

};

Phaser.Game.prototype = {

	/**
	* Initialize engine sub modules and start the game.
	* @param parent {string} ID of parent Dom element.
	* @param width {number} Width of the game screen.
	* @param height {number} Height of the game screen.
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

			this.onPause = new Phaser.Signal;
			this.onResume = new Phaser.Signal;

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

			this.load.onLoadComplete.add(this.loadComplete, this);

			this.stage.boot();
			this.world.boot();
			this.input.boot();
			this.sound.boot();
			this.state.boot();

			if (this.renderType == Phaser.CANVAS)
			{
				console.log('%cPhaser ' + Phaser.VERSION + ' initialized. Rendering to Canvas', 'color: #ffff33; background: #000000');
			}
			else
			{
				console.log('%cPhaser ' + Phaser.VERSION + ' initialized. Rendering to WebGL', 'color: #ffff33; background: #000000');
			}

	        this.isRunning = true;
            this._loadComplete = false;

			this.raf = new Phaser.RequestAnimationFrame(this);
			this.raf.start();

		}

	},

	setUpRenderer: function () {

		if (this.renderType === Phaser.CANVAS || (this.renderType === Phaser.AUTO && this.device.webGL == false))
		{
			if (this.device.canvas)
			{
				this.renderType = Phaser.CANVAS;
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
			//	They requested WebGL, and their browser supports it
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
    */
    loadComplete: function () {

        this._loadComplete = true;

        this.state.loadComplete();

    },

	update: function (time) {

		this.time.update(time);

		if (!this._paused)
		{
	        this.plugins.preUpdate();
	        this.physics.preUpdate();

	        this.input.update();
	        this.tweens.update();
	        this.sound.update();
			this.world.update();
			this.particles.update();
			this.state.update();
	        this.plugins.update();

			this.renderer.render(this.stage._stage);
			this.plugins.render();
			this.state.render();

			this.plugins.postRender();
		}

	},

	/**
    * Nuke the entire game from orbit
    */
    destroy: function () {

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

Object.defineProperty(Phaser.Game.prototype, "paused", {

    get: function () {
        return this._paused;
    },

    set: function (value) {

    	if (value === true)
    	{
    		if (this._paused == false)
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

