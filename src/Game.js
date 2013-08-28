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

Phaser.Game = function (callbackContext, parent, width, height, preloadCallback, createCallback, updateCallback, renderCallback, destroyCallback) {

	if (typeof parent === "undefined") { parent = ''; }
	if (typeof width === "undefined") { width = 800; }
	if (typeof height === "undefined") { height = 600; }
	if (typeof preloadCallback === "undefined") { preloadCallback = null; }
	if (typeof createCallback === "undefined") { createCallback = null; }
	if (typeof updateCallback === "undefined") { updateCallback = null; }
	if (typeof renderCallback === "undefined") { renderCallback = null; }
	if (typeof destroyCallback === "undefined") { destroyCallback = null; }

	this.id = Phaser.GAMES.push(this) - 1;

	this.callbackContext = callbackContext;
	this.onPreloadCallback = preloadCallback;
	this.onCreateCallback = createCallback;
	this.onUpdateCallback = updateCallback;
	this.onRenderCallback = renderCallback;
	this.onDestroyCallback = destroyCallback;

	var _this = this;

	if (document.readyState === 'complete' || document.readyState === 'interactive')
	{
		setTimeout(function () {
			return Phaser.GAMES[_this.id].boot(parent, width, height);
		});
	}
	else
	{
		document.addEventListener('DOMContentLoaded', Phaser.GAMES[_this.id].boot(parent, width, height), false);
		window.addEventListener('load', Phaser.GAMES[_this.id].boot(parent, width, height), false);
	}

};

Phaser.Game.prototype = {

	/**
	* Phaser Game ID.
	* @type {number}
	*/
	id: 0,

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
	* The state to be switched to in the next frame.
	* @type {State}
	*/
	_pendingState: null,

	/**
	* The current State object (defaults to null)
	* @type {State}
	*/
	state: null,
	
	/**
	* This will be called when init states. (loading assets...)
	* @type {function}
	*/
	onPreloadCallback: null,
	
	/**
	* This will be called when create states. (setup states...)
	* @type {function}
	*/
	onCreateCallback: null,

	/**
	* This will be called when State is updated, this doesn't happen during load (see onLoadUpdateCallback)
	* @type {function}
	*/
	onUpdateCallback: null,

	/**
	* This will be called when the State is rendered, this doesn't happen during load (see onLoadRenderCallback)
	* @type {function}
	*/
	onRenderCallback: null,

	/**
	* This will be called before the State is rendered and before the stage is cleared
	* @type {function}
	*/
	onPreRenderCallback: null,

	/**
	* This will be called when the State is updated but only during the load process
	* @type {function}
	*/
	onLoadUpdateCallback: null,

	/**
	* This will be called when the State is rendered but only during the load process
	* @type {function}
	*/
	onLoadRenderCallback: null,

	/**
	* This will be called when states paused.
	* @type {function}
	*/
	onPausedCallback: null,

	/**
	* This will be called when the state is destroyed (i.e. swapping to a new state)
	* @type {function}
	*/
	onDestroyCallback: null,

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
	* Initialize engine sub modules and start the game.
	* @param parent {string} ID of parent Dom element.
	* @param width {number} Width of the game screen.
	* @param height {number} Height of the game screen.
	*/
	boot: function (parent, width, height) {

		var _this = this;

		if (this.isBooted) {
			return;
		}

		if (!document.body) {
			setTimeout(function () {
				return Phaser.GAMES[_this.id].boot(parent, width, height);
			}, 13);
		}
		else
		{
			document.removeEventListener('DOMContentLoaded', Phaser.GAMES[_this.id].boot);
			window.removeEventListener('load', Phaser.GAMES[_this.id].boot);

			console.log('Phaser', Phaser.VERSION, 'alive');

			// this.onPause = new Phaser.Signal();
			// this.onResume = new Phaser.Signal();
			this.device = new Phaser.Device();
			this.net = new Phaser.Net(this);
			// this.math = new Phaser.GameMath(this);
			// this.stage = new Phaser.Stage(this, parent, width, height);
			// this.world = new Phaser.World(this, width, height);
			// this.add = new Phaser.GameObjectFactory(this);
			this.cache = new Phaser.Cache(this);
			this.load = new Phaser.Loader(this);
			this.time = new Phaser.Time(this);
			// this.tweens = new Phaser.TweenManager(this);
			// this.input = new Phaser.InputManager(this);
			// this.sound = new Phaser.SoundManager(this);
			this.rnd = new Phaser.RandomDataGenerator([(Date.now() * Math.random()).toString()]);
			// this.physics = new Phaser.Physics.PhysicsManager(this);
			// this.plugins = new Phaser.PluginManager(this, this);
			// this.load.onLoadComplete.add(this.loadComplete, this);
			// this.setRenderer(Phaser.Types.RENDERER_CANVAS);
			// this.world.boot();
			// this.stage.boot();
			// this.input.boot();

			this.isBooted = true;
		}

	},

};
