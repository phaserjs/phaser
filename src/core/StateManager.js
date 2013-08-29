Phaser.StateManager = function (game, pendingState) {

	this.game = game;

	this.states = {};

	this._pendingState = pendingState;

};

Phaser.StateManager.prototype = {
	
	/**
	* @type {Phaser.Game}
	*/
	game: null,

	/**
	* The state to be switched to in the next frame.
	* @type {State}
	*/
	_pendingState: null,

	/**
	* The state to be switched to in the next frame.
	* @type {Object}
	*/
	states: {},

	/**
	* The current active State object (defaults to null)
	* @type {String}
	*/
	current: '',
	
	/**
	* This will be called when the state is started (i.e. set as the current active state)
	* @type {function}
	*/
	onInitCallback: null,

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
	* This will be called when the state is shut down (i.e. swapped to another state)
	* @type {function}
	*/
	onShutDownCallback: null,

	boot: function () {

		console.log('Phaser.StateManager.boot');
		console.log(typeof this._pendingState);

		this.add('default', this._pendingState, true);

	},

	/**
    * Add a new State.
    * @param key {String} A unique key you use to reference this state, i.e. "MainMenu", "Level1".
    * @param state {State} The state you want to switch to.
    * @param autoStart {Boolean} Start the state immediately after creating it? (default true)
    */
    add: function (key, state, autoStart) {

        if (typeof autoStart === "undefined") { autoStart = true; }

		console.log('Phaser.StateManager.addState', key);
		console.log(typeof state);

		var newState;

		if (state instanceof Phaser.State)
		{
			console.log('Phaser.StateManager.addState: Phaser.State given');
			newState = state;
    		newState.link(this.game);
		}
		else if (typeof state === 'object')
		{
			console.log('Phaser.StateManager.addState: Object given');
			newState = state;
		}
		else if (typeof state === 'function')
		{
			console.log('Phaser.StateManager.addState: Function given');
			newState = new state(this.game);
		}

		this.states[key] = newState;

		if (autoStart)
		{
			this.start(key);
		}

		return newState;

    },

    remove: function (key) {

    },

	/**
    * Start the given state
    * @param key {String} The key of the state you want to start.
    * @param [clearWorld] {bool} clear everything in the world? (Default to true)
    * @param [clearCache] {bool} clear asset cache? (Default to false and ONLY available when clearWorld=true)
    */
    start: function (key, clearWorld, clearCache) {

    	console.log('Phaser.StateManager.start', key);
    	// console.log(this);
    	// console.log(this.callbackContext);

        if (typeof clearWorld === "undefined") { clearWorld = true; }
        if (typeof clearCache === "undefined") { clearCache = false; }

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

	        if (clearWorld) {

	            //this.game.world.destroy();

	            if (clearCache == true) {
	                this.game.cache.destroy();
	            }
	        }

			this.setCurrentState(key);
		}

        if (this.onPreloadCallback)
        {
	    	console.log('Preload Callback found');
            this.game.load.reset();
            this.onPreloadCallback.call(this.callbackContext);

            //  Is the loader empty?
            if (this.game.load.queueSize == 0)
            {
		    	console.log('Loader queue empty');
                this.game.loadComplete();

                if (this.onCreateCallback)
                {
                    this.onCreateCallback.call(this.callbackContext);
                }
            }
            else
            {
		    	console.log('Loader started');
                //  Start the loader going as we have something in the queue
                this.game.load.start();
            }
        }
        else
        {
			console.log('Preload callback not found');
            //  No init? Then there was nothing to load either
            if (this.onCreateCallback)
            {
				console.log('Create callback found');
                this.onCreateCallback.call(this.callbackContext);
            }

            this.game.loadComplete();
        }

    },

	//	Used by onInit and onShutdown when those functions don't exist on the state
    dummy: function () {
    },

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

	setCurrentState: function (key) {

        this.callbackContext = this.states[key];

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

		this.onInitCallback.call(this.callbackContext);

	},

	/**
    * Switch to a new State.
    * @param state {State} The state you want to switch to. If a string will be treated as a reference to an already stored state.
    * @param [clearWorld] {bool} clear everything in the world? (Default to true)
    * @param [clearCache] {bool} clear asset cache? (Default to false and ONLY available when clearWorld=true)
    */
    OLDswitchState: function (state, clearWorld, clearCache) {

        if (typeof clearWorld === "undefined") { clearWorld = true; }
        if (typeof clearCache === "undefined") { clearCache = false; }

		console.log('Phaser.StateManager.switchState');
		console.log(typeof state);

		var result = false;
		var newState;

		//	Check the pendingState object to see if it contains anything we can use
		if (typeof state === 'string')
		{
			console.log('Phaser.StateManager.boot: string given');
		}
		else if (state instanceof Phaser.State)
		{
			console.log('Phaser.StateManager.boot: Phaser.State given');
			newState = state;
    		newState.link(this.game);
			result = this.setCallbacks();
		}
		else if (typeof state === 'object')
		{
			console.log('Phaser.StateManager.boot: Object given');
			newState = state;
			result = this.setCallbacks();
		}
		else if (typeof state === 'function')
		{
			console.log('Phaser.StateManager.boot: function reference given');
			newState = new state(this.game);
			result = this.setCallbacks();
		}

		if (result)
		{
			console.log("We've been given and successfully parsed a valid state");

			var idx = this.states.push(newState);

			//	We've been given and successfully parsed a valid state
			this.startState();
		}

		return result;

    },




	/**
    * Start the current state
    */
    OLDstartState: function () {
			result = this.setCallbacks();

    	console.log('Phaser.StateManager.startState');
    	// console.log(this);
    	// console.log(this.callbackContext);



        if (this.onPreloadCallback !== null)
        {
	    	console.log('Preload Callback found');
            this.game.load.reset();
            this.onPreloadCallback.call(this.callbackContext);
            // this.onPreloadCallback.call(this.onPreloadCallback);

            //  Is the loader empty?
            if (this.game.load.queueSize == 0)
            {
		    	console.log('Loader queue empty');
                // this.game._loadComplete = true;
                this.game.loadComplete();

                if (this.onCreateCallback !== null)
                {
                    this.onCreateCallback.call(this.callbackContext);
                    // this.onCreateCallback.call(this.onCreateCallback);
                }
            }
            else
            {
		    	console.log('Loader started');
                //  Start the loader going as we have something in the queue
                this.game.load.start();
            }
        }
        else
        {
			console.log('Preload callback not found');
            //  No init? Then there was nothing to load either
            if (this.onCreateCallback) {
				console.log('Create callback found');
                this.onCreateCallback.call(this.callbackContext);
                // this.onCreateCallback.call(this.onCreateCallback);
            }

            // this.game._loadComplete = true;
            this.game.loadComplete();
        }

    },

    loadComplete: function () {

		console.log('Phaser.StateManager.loadComplete');

        if (this.onCreateCallback) {
			console.log('Create callback found');
            this.onCreateCallback.call(this.callbackContext);
            // this.onCreateCallback.call(this.onCreateCallback);
        }

    },

	/**
    * Switch to a new State.
    * @param state {State} The state you want to switch to.
    * @param [clearWorld] {bool} clear everything in the world? (Default to true)
    * @param [clearCache] {bool} clear asset cache? (Default to false and ONLY available when clearWorld=true)
    */

    /*
    switchState: function (state, clearWorld, clearCache) {

    	// console.log('switchState', state, this.isBooted);
    	// console.log(typeof state);
    	// console.log(state instanceof Phaser.State);

        if (typeof clearWorld === "undefined") { clearWorld = true; }
        if (typeof clearCache === "undefined") { clearCache = false; }

    	if (state instanceof Phaser.State) {
    		state.link(this);
    	}

        if (this.isBooted == false) {
            this._pendingState = state;
            return;
        }

        //  Destroy current state?
        if (this.onDestroyCallback !== null) {
            this.onDestroyCallback.call(this.callbackContext);
        }

        if (this.input) {
	        this.input.reset(true);
        }

        //  Prototype?
        if (typeof state === 'function')
        {
            this.state = new state(this);
        }
        else
        {
            this.state = state;
        }

        //  Ok, have we got at least a create or update function?
        if (this.state['create'] || this.state['update']) {

            this.callbackContext = this.state;

            //  Bingo, let's set them up
            this.onPreloadCallback = this.state['preload'] || null;
            this.onLoadRenderCallback = this.state['loadRender'] || null;
            this.onLoadUpdateCallback = this.state['loadUpdate'] || null;
            this.onCreateCallback = this.state['create'] || null;
            this.onUpdateCallback = this.state['update'] || null;
            this.onPreRenderCallback = this.state['preRender'] || null;
            this.onRenderCallback = this.state['render'] || null;
            this.onPausedCallback = this.state['paused'] || null;
            this.onDestroyCallback = this.state['destroy'] || null;
            
            if (clearWorld) {

                //this.world.destroy();

                if (clearCache == true) {
                    this.cache.destroy();
                }
            }

            this._loadComplete = false;

            this.startState();
        }
        else
        {
            console.warn("Invalid Phaser State object given. Must contain at least a create or update function.");
        }
    },

    */

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

    }

};