/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.StateManager
*/

/**
* Description.
* 
* @class Phaser.StateManager
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {Description} pendingState - Description.
*/
Phaser.StateManager = function (game, pendingState) {

	/**
	* A reference to the currently running game.
	* @property {Phaser.Game} game.
	*/
	this.game = game;

	/**
	* Description.
	* @property {Description} states.
	*/
	this.states = {};

	if (pendingState !== null)
	{
		this._pendingState = pendingState;
	}

};

Phaser.StateManager.prototype = {
	
	/**
	* A reference to the currently running game.
	* @property {Phaser.Game} game.
	*/
	game: null,

	/**
	* The state to be switched to in the next frame.
	* @property {State} _pendingState 
	* @private
	*/
	_pendingState: null,

	/**
	* Flag that sets if the State has been created or not.
	* @property {boolean}_created
	* @private
	*/
	_created: false,

	/**
	* The state to be switched to in the next frame.
	* @property {Description} states
	*/
	states: {},

	/**
	* The current active State object (defaults to null).
	* @property {string} current
	*/
	current: '',
	
	/**
	* This will be called when the state is started (i.e. set as the current active state).
	* @property {function} onInitCallback
	*/
	onInitCallback: null,

	/**
	* This will be called when init states (loading assets...).
	* @property {function} onPreloadCallback
	*/
	onPreloadCallback: null,
	
	/**
	* This will be called when create states (setup states...).
	* @property {function} onCreateCallback
	*/
	onCreateCallback: null,

	/**
	* This will be called when State is updated, this doesn't happen during load (@see onLoadUpdateCallback).
	* @property {function} onUpdateCallback
	*/
	onUpdateCallback: null,

	/**
	* This will be called when the State is rendered, this doesn't happen during load (see onLoadRenderCallback).
	* @property {function} onRenderCallback
	*/
	onRenderCallback: null,

	/**
	* This will be called before the State is rendered and before the stage is cleared.
	* @property {function} onPreRenderCallback
	*/
	onPreRenderCallback: null,

	/**
	* This will be called when the State is updated but only during the load process.
	* @property {function} onLoadUpdateCallback
	*/
	onLoadUpdateCallback: null,

	/**
	* This will be called when the State is rendered but only during the load process.
	* @property {function} onLoadRenderCallback
	*/
	onLoadRenderCallback: null,

	/**
	* This will be called when states paused.
	* @property {function} onPausedCallback
	*/
	onPausedCallback: null,

	/**
	* This will be called when the state is shut down (i.e. swapped to another state).
	* @property {function} onShutDownCallback
	*/
	onShutDownCallback: null,

	/**
	* Description.
	* @method boot
	*/
	boot: function () {

		// console.log('Phaser.StateManager.boot');

		if (this._pendingState !== null)
		{
			// console.log('_pendingState found');
			// console.log(typeof this._pendingState);

			if (typeof this._pendingState === 'string')
			{
				//	State was already added, so just start it
				this.start(this._pendingState, false, false);
			}
			else
			{
				this.add('default', this._pendingState, true);
			}

		}

	},

	/**
    * Add a new State.
    * @method add
    * @param key {string} - A unique key you use to reference this state, i.e. "MainMenu", "Level1".
    * @param state {State} - The state you want to switch to.
    * @param autoStart {boolean} - Start the state immediately after creating it? (default true)
    */
    add: function (key, state, autoStart) {

        if (typeof autoStart === "undefined") { autoStart = false; }

		// console.log('Phaser.StateManager.addState', key);
		// console.log(typeof state);
		// console.log('autoStart?', autoStart);

		var newState;

		if (state instanceof Phaser.State)
		{
			// console.log('Phaser.StateManager.addState: Phaser.State given');
			newState = state;
		}
		else if (typeof state === 'object')
		{
			// console.log('Phaser.StateManager.addState: Object given');
			newState = state;
			newState.game = this.game;
		}
		else if (typeof state === 'function')
		{
			// console.log('Phaser.StateManager.addState: Function given');
			newState = new state(this.game);
		}

		this.states[key] = newState;

		if (autoStart)
		{
			if (this.game.isBooted)
			{
				// console.log('Game is booted, so we can start the state now');
				this.start(key);
			}
			else
			{
				// console.log('Game is NOT booted, so set the current state as pending');
				this._pendingState = key;
			}
		}

		return newState;

    },

	/**
     * Delete the given state.
     * @method remove
     * @param {string} key - A unique key you use to reference this state, i.e. "MainMenu", "Level1".
     */
    remove: function (key) {

    	if (this.current == key)
    	{
	        this.callbackContext = null;

	        this.onInitCallback = null;
	        this.onShutDownCallback = null;

	        this.onPreloadCallback = null;
	        this.onLoadRenderCallback = null;
	        this.onLoadUpdateCallback = null;
	        this.onCreateCallback = null;
	        this.onUpdateCallback = null;
	        this.onRenderCallback = null;
	        this.onPausedCallback = null;
	        this.onDestroyCallback = null;
    	}

    	delete this.states[key];

    },

	/**
    * Start the given state
    * @method start
    * @param {string} key - The key of the state you want to start.
    * @param {boolean} [clearWorld] - clear everything in the world? (Default to true)
    * @param {boolean} [clearCache] - clear asset cache? (Default to false and ONLY available when clearWorld=true)
    */
    start: function (key, clearWorld, clearCache) {

    	// console.log('Phaser.StateManager.start', key);
    	// console.log(this);
    	// console.log(this.callbackContext);

        if (typeof clearWorld === "undefined") { clearWorld = true; }
        if (typeof clearCache === "undefined") { clearCache = false; }

        if (this.game.isBooted == false)
        {
			// console.log('Game is NOT booted, so set the requested state as pending');
			this._pendingState = key;
			return;
        }

		if (this.checkState(key) == false)
		{
			return;
		}
		else
		{
			//	Already got a state running?
			if (this.current)
			{
				this.onShutDownCallback.call(this.callbackContext);
			}

	        if (clearWorld)
	        {
				this.game.tweens.removeAll();

	            this.game.world.destroy();

	            if (clearCache == true)
	            {
	                this.game.cache.destroy();
	            }
	        }

			this.setCurrentState(key);
		}

        if (this.onPreloadCallback)
        {
	    	// console.log('Preload Callback found');
            this.game.load.reset();
            this.onPreloadCallback.call(this.callbackContext);

            //  Is the loader empty?
            if (this.game.load.queueSize == 0)
            {
		    	// console.log('Loader queue empty');
                this.game.loadComplete();
            }
            else
            {
		    	// console.log('Loader started');
                //  Start the loader going as we have something in the queue
                this.game.load.start();
            }
        }
        else
        {
			// console.log('Preload callback not found');
            //  No init? Then there was nothing to load either
            this.game.loadComplete();
        }

    },
	
	/**
	* Used by onInit and onShutdown when those functions don't exist on the state
    * @method dummy
    * @private
    */
    dummy: function () {
    },

	/**
    * Description.
    * @method checkState
    * @param {string} key - The key of the state you want to check.
    * @return {boolean} Description.
    */
    checkState: function (key) {

		if (this.states[key])
		{
			var valid = false;

			if (this.states[key]['preload']) { valid = true; }

			if (valid == false && this.states[key]['loadRender']) { valid = true; }
			if (valid == false && this.states[key]['loadUpdate']) { valid = true; }
			if (valid == false && this.states[key]['create']) { valid = true; }
			if (valid == false && this.states[key]['update']) { valid = true; }
			if (valid == false && this.states[key]['preRender']) { valid = true; }
			if (valid == false && this.states[key]['render']) { valid = true; }
			if (valid == false && this.states[key]['paused']) { valid = true; }

        	if (valid == false)
        	{
	            console.warn("Invalid Phaser State object given. Must contain at least a one of the required functions.");
	            return false;
	        }

			return true;
		}
		else
		{
			console.warn("Phaser.StateManager - No state found with the key: " + key);
			return false;
		}

    },

	/**
    * Description.
    * @method link
    * @param {string} key - Description.
    */
    link: function (key) {

		// console.log('linked');
        this.states[key].game = this.game;
        this.states[key].add = this.game.add;
        this.states[key].camera = this.game.camera;
        this.states[key].cache = this.game.cache;
        this.states[key].input = this.game.input;
        this.states[key].load = this.game.load;
        this.states[key].math = this.game.math;
        this.states[key].sound = this.game.sound;
        this.states[key].stage = this.game.stage;
        this.states[key].time = this.game.time;
        this.states[key].tweens = this.game.tweens;
        this.states[key].world = this.game.world;
        this.states[key].particles = this.game.particles;
        this.states[key].physics = this.game.physics;
        this.states[key].rnd = this.game.rnd;

    },

	/**
    * Description.
    * @method setCurrentState
    * @param {string} key - Description.
    */
	setCurrentState: function (key) {

        this.callbackContext = this.states[key];

        this.link(key);

        //	Used when the state is set as being the current active state
        this.onInitCallback = this.states[key]['init'] || this.dummy;

        this.onPreloadCallback = this.states[key]['preload'] || null;
        this.onLoadRenderCallback = this.states[key]['loadRender'] || null;
        this.onLoadUpdateCallback = this.states[key]['loadUpdate'] || null;
        this.onCreateCallback = this.states[key]['create'] || null;
        this.onUpdateCallback = this.states[key]['update'] || null;
        this.onPreRenderCallback = this.states[key]['preRender'] || null;
        this.onRenderCallback = this.states[key]['render'] || null;
        this.onPausedCallback = this.states[key]['paused'] || null;

        //	Used when the state is no longer the current active state
        this.onShutDownCallback = this.states[key]['shutdown'] || this.dummy;

		this.current = key;
		this._created = false;

		this.onInitCallback.call(this.callbackContext);

	},

	/**
	* Description.
	* @method loadComplete
	*/
    loadComplete: function () {

		// console.log('Phaser.StateManager.loadComplete');

        if (this._created == false && this.onCreateCallback)
        {
			// console.log('Create callback found');
	        this._created = true;
            this.onCreateCallback.call(this.callbackContext);
        }
        else
        {
	        this._created = true;
        }

    },

	/**
	* Description.
	* @method update
	*/
    update: function () {

    	if (this._created && this.onUpdateCallback)
    	{
			this.onUpdateCallback.call(this.callbackContext);
    	}
    	else
    	{
		    if (this.onLoadUpdateCallback)
		    {
		    	this.onLoadUpdateCallback.call(this.callbackContext);
			}
		}

    },

	/**
	* Description.
	* @method preRender
	*/
    preRender: function () {

	    if (this.onPreRenderCallback)
	    {
	    	this.onPreRenderCallback.call(this.callbackContext);
		}

    },

	/**
	* Description.
	* @method render
	*/
    render: function () {

    	if (this._created && this.onRenderCallback)
    	{
			this.onRenderCallback.call(this.callbackContext);
    	}
    	else
    	{
		    if (this.onLoadRenderCallback)
		    {
		    	this.onLoadRenderCallback.call(this.callbackContext);
			}
		}

    },

	/**
    * Nuke the entire game from orbit
    * @method destroy
    */
    destroy: function () {

        this.callbackContext = null;

        this.onInitCallback = null;
        this.onShutDownCallback = null;

        this.onPreloadCallback = null;
        this.onLoadRenderCallback = null;
        this.onLoadUpdateCallback = null;
        this.onCreateCallback = null;
        this.onUpdateCallback = null;
        this.onRenderCallback = null;
        this.onPausedCallback = null;
        this.onDestroyCallback = null;

        this.game = null;
        this.states = {};
        this._pendingState = null;

    }

};
