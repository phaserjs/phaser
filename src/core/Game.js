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

	if (typeof width === "undefined") { width = 800; }
	if (typeof height === "undefined") { height = 600; }
	if (typeof renderer === "undefined") { renderer = Phaser.AUTO; }
	if (typeof parent === "undefined") { parent = ''; }
	if (typeof state === "undefined") { state = null; }
	if (typeof transparent === "undefined") { transparent = false; }
	if (typeof antialias === "undefined") { antialias = true; }

	this.id = Phaser.GAMES.push(this) - 1;
	this.parent = parent;

	//	Do some more intelligent size parsing here, so they can set "100%" for example, maybe pass the scale mode in here too?
	this.width = width;
	this.height = height;
	this.transparent = transparent;
	this.antialias = antialias;
	this.renderType = renderer;

	this.state = new Phaser.StateManager(this, state);

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

	//	temps so we can clean-up the event listeneres
	_tempState: null,
	_onBoot: null,

	/**
	* Phaser Game ID.
	* @type {number}
	*/
	id: 0,

	/**
	* The Game width (in pixels).
	* @type {number}
	*/
	width: 0,

	/**
	* The Game height (in pixels).
	* @type {number}
	*/
	height: 0,

	transparent: false,
	antialias: true,

	/**
	* The Games DOM parent.
	* @type {HTMLElement}
	*/
	parent: '',

	/**
	* The Renderer this Phaser.Game will use. Either Phaser.RENDERER_AUTO, Phaser.RENDERER_CANVAS or Phaser.RENDERER_WEBGL
	* @type {number}
	*/
	renderType: 0,

	/**
	* The Pixi Renderer
	* @type {number}
	*/
	renderer: null,

	/**
	* Whether load complete loading or not.
	* @type {bool}
	*/
	_loadComplete: false,

	/**
	* Is game paused?
	* @type {bool}
	*/
	paused: false,

	/**
	* Whether the game engine is booted, aka available.
	* @type {bool}
	*/
	isBooted: false,

	/**
	* Is game running or paused?
	* @type {bool}
	*/
	isRunning: false,

	/**
	* Automatically handles the core game loop via requestAnimationFrame or setTimeout
     * @type {Phaser.RequestAnimationFrame}
	*/
	raf: null,

    /**
     * The StateManager.
     * @type {Phaser.StateManager}
     */
    state: null,

    /**
     * Reference to the GameObject Factory.
     * @type {Phaser.GameObjectFactory}
     */
    add: null,

    /**
     * Reference to the assets cache.
     * @type {Phaser.Cache}
     */
    cache: null,

    /**
     * Reference to the input manager
     * @type {Phaser.InputManager}
     */
    input: null,

    /**
     * Reference to the assets loader.
     * @type {Phaser.Loader}
     */
    load: null,

    /**
     * Reference to the math helper.
     * @type {Phaser.GameMath}
     */
    math: null,

    /**
     * Reference to the network class.
     * @type {Phaser.Net}
     */
    net: null,

    /**
     * Reference to the sound manager.
     * @type {Phaser.SoundManager}
     */
    sound: null,

    /**
     * Reference to the stage.
     * @type {Phaser.Stage}
     */
    stage: null,

    /**
     * Reference to game clock.
     * @type {Phaser.TimeManager}
     */
    time: null,

    /**
     * Reference to the tween manager.
     * @type {Phaser.TweenManager}
     */
    tweens: null,

    /**
     * Reference to the world.
     * @type {Phaser.World}
     */
    world: null,

    /**
     * Reference to the physics manager.
     * @type {Phaser.Physics.PhysicsManager}
     */
    physics: null,

    /**
     * Instance of repeatable random data generator helper.
     * @type {Phaser.RandomDataGenerator}
     */
    rnd: null,

    /**
     * Contains device information and capabilities.
     * @type {Phaser.Device}
     */
    device: null,

	/**
	* Initialize engine sub modules and start the game.
	* @param parent {string} ID of parent Dom element.
	* @param width {number} Width of the game screen.
	* @param height {number} Height of the game screen.
	*/
	boot: function () {

		if (this.isBooted) {
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

			this.setUpRenderer();

			this.world = new Phaser.World(this);
			this.stage = new Phaser.Stage(this);
			this.add = new Phaser.GameObjectFactory(this);
			this.cache = new Phaser.Cache(this);
			this.load = new Phaser.Loader(this);
			this.time = new Phaser.Time(this);
			this.tweens = new Phaser.TweenManager(this);
			// this.input = new Phaser.InputManager(this);
			// this.sound = new Phaser.SoundManager(this);
			// this.physics = new Phaser.Physics.PhysicsManager(this);
			this.plugins = new Phaser.PluginManager(this, this);
			this.net = new Phaser.Net(this);

			this.load.onLoadComplete.add(this.loadComplete, this);

			this.state.boot();
			// this.stage.boot();
			// this.input.boot();

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

		if (this.renderType == Phaser.CANVAS || (this.renderType == Phaser.AUTO && this.device.webGL == false))
		{
			if (this.device.canvas)
			{
				this.renderType = Phaser.CANVAS;
				this.renderer = new PIXI.CanvasRenderer(this.width, this.height, null, this.transparent);
				Phaser.Canvas.setSmoothingEnabled(this.renderer.context, this.antialias);
			}
			else
			{
				throw new Error('Phaser.Game - cannot create Canvas or WebGL context, aborting.');
			}
		}
		else
		{
			//	They must have requested WebGL and their browser supports it
			this.renderer = new PIXI.WebGLRenderer(this.width, this.height, null, this.transparent, this.antialias);
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

        //	?
		// this.load.onLoadComplete.remove(this.loadComplete, this);

    },

	update: function (time) {

		this.time.update(time);

        this.plugins.preUpdate();

        this.tweens.update();
        // this.input.update();
        // this.stage.update();
        // this.sound.update();
        // this.physics.update();
        this.world.update();
		this.state.update();
        this.plugins.update();

		this.renderer.render(this.world._stage);

		this.plugins.postRender();

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
