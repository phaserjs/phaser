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
Phaser.Game = function (width, height, renderer, parent, state) {

	if (typeof width === "undefined") { width = 800; }
	if (typeof height === "undefined") { height = 600; }
	if (typeof renderer === "undefined") { renderer = Phaser.RENDERER_AUTO; }
	if (typeof parent === "undefined") { parent = ''; }
	if (typeof state === "undefined") { state = {}; }

	this.id = Phaser.GAMES.push(this) - 1;
	this.parent = parent;

	//	Do some more intelligent size parsing here, so they can set "100%" for example, maybe pass the scale mode in here too?
	this.width = width;
	this.height = height;

	this.renderer = renderer;

	console.log('Phaser.Game', width, height, renderer, parent);

	//	Pass 'state' to the StateManager?
	this.state = new Phaser.StateManager(this, state);
	// this._tempState = state;

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

	/**
	* The Games DOM parent.
	* @type {HTMLElement}
	*/
	parent: '',

	/**
	* The Renderer this Phaser.Game will use. Either Phaser.RENDERER_AUTO, Phaser.RENDERER_CANVAS or Phaser.RENDERER_WEBGL
	* @type {number}
	*/
	renderer: 0,

	/**
	* Whether load complete loading or not.
	* @type {bool}
	*/
	_loadComplete: false,

	/**
	* Game is paused?
	* @type {bool}
	*/
	_paused: false,

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

		console.log('Phaser.Game boot');

		//	Probably not needed any more
		// var _this = this;

		if (!document.body) {
			window.setTimeout(this._onBoot, 20);
			// setTimeout(Phaser.GAMES[_this.id].boot(parent, width, height), 13);
		}
		else
		{
			document.removeEventListener('DOMContentLoaded', this._onBoot);
			window.removeEventListener('load', this._onBoot);

			this.onPause = new Phaser.Signal();
			this.onResume = new Phaser.Signal();

			this.device = new Phaser.Device();
			this.net = new Phaser.Net(this);
			this.math = Phaser.Math;
			// this.stage = new Phaser.Stage(this, parent, width, height);
			// this.world = new Phaser.World(this, width, height);
			// this.add = new Phaser.GameObjectFactory(this);
			this.cache = new Phaser.Cache(this);
			this.load = new Phaser.Loader(this);
			this.time = new Phaser.Time(this);
			this.tweens = new Phaser.TweenManager(this);
			// this.input = new Phaser.InputManager(this);
			// this.sound = new Phaser.SoundManager(this);
			this.rnd = new Phaser.RandomDataGenerator([(Date.now() * Math.random()).toString()]);
			// this.physics = new Phaser.Physics.PhysicsManager(this);
			this.plugins = new Phaser.PluginManager(this, this);
			// this.state = new Phaser.StateManager(this, this._tempState);

			this.load.onLoadComplete.add(this.loadComplete, this);

			this.state.boot();
			// this.world.boot();
			// this.stage.boot();
			// this.input.boot();

			console.log('Phaser', Phaser.VERSION, 'initialized');

			this.isBooted = true;
	        this.isRunning = true;
            this._loadComplete = false;

			// this.raf = new Phaser.RequestAnimationFrame(this);
			// this.raf.start();

			//	boot sm

		}

	},

	/**
	* Launch the game
	* @param callbackContext Which context will the callbacks be called with.
	* @param preloadCallback {function} Preload callback invoked when init default screen.
	* @param createCallback {function} Create callback invoked when create default screen.
	* @param updateCallback {function} Update callback invoked when update default screen.
	* @param renderCallback {function} Render callback invoked when render default screen.
	*/
	launch: function (context, preload, create, update, render) {

		/*
		this.callbackContext = context;

	    this.onPreloadCallback = preload || null;
	    this.onCreateCallback = create || null;
	    this.onUpdateCallback = update || null;
	    this.onRenderCallback = render || null;

        if (this.onPreloadCallback == null && this.onCreateCallback == null && this.onUpdateCallback == null && this.onRenderCallback == null && this._pendingState == null)
        {
        	console.warn("Phaser cannot start: No preload, create, update or render functions given and no pending State found");
        }
        else
        {
			if (this.isBooted)
			{
				console.log('launch has set the callbacks and dom is booted so lets rock');

				this.startState();

			    // if (this._pendingState)
			    // {
			    //     this.switchState(this._pendingState, false, false);
			    // }
			    // else
			    // {
			    //     this.startState();
			    // }

			}
			else
			{
				console.log('launch has set the callbacks but cant start because the DOM isnt booted yet');
			}
        }
        */

	},

	/**
    * Called when the load has finished, after preload was run.
    */
    loadComplete: function () {

    	console.log('loadComplete', this);

        this._loadComplete = true;

        this.state.loadComplete();

		this.load.onLoadComplete.remove(this.loadComplete, this);

        // if (this.onCreateCallback) {
	       //  this.onCreateCallback.call(this.callbackContext);
	       //  // this.onCreateCallback.call(this);
        // }

    },

	update: function (time) {

		this.time.update(time);

        this.plugins.preUpdate();

        this.tweens.update();
        // this.input.update();
        // this.stage.update();
        // this.sound.update();
        // this.physics.update();
        // this.world.update();

        this.plugins.update();

        if (this._loadComplete)
        {
	        if (this.onUpdateCallback)
	        {
            	this.onUpdateCallback.call(this.callbackContext);
        	}
	
	        // this.world.postUpdate();
	        this.plugins.postUpdate();
	        this.plugins.preRender();

	        if (this.onPreRenderCallback)
	        {
	            this.onPreRenderCallback.call(this.callbackContext);
	        }

	        // this.renderer.render();
	        this.plugins.render();

        	if (this.onRenderCallback)
        	{
	            this.onRenderCallback.call(this.callbackContext);
        	}

	        this.plugins.postRender();
        }
        else
        {
        	//	Still loading assets
	        if (this.onLoadUpdateCallback)
	        {
	            this.onLoadUpdateCallback.call(this.callbackContext);
	        }
	
	        // this.world.postUpdate();
	        this.plugins.postUpdate();
	        this.plugins.preRender();
	        // this.renderer.render();
	        this.plugins.render();

        	if (this.onLoadRenderCallback)
        	{
            	this.onLoadRenderCallback.call(this.callbackContext);
        	}

	        this.plugins.postRender();
        }

	},

	/**
    * Nuke the entire game from orbit
    */
    destroy: function () {

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

};
