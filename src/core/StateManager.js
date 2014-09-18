/* jshint newcap: false */

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The State Manager is responsible for loading, setting up and switching game states.
*
* @class Phaser.StateManager
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {Phaser.State|Object} [pendingState=null] - A State object to seed the manager with.
*/
Phaser.StateManager = function (game, pendingState) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

    /**
    * @property {Object} states - The object containing Phaser.States.
    */
    this.states = {};

    /**
    * @property {Phaser.State} _pendingState - The state to be switched to in the next frame.
    * @private
    */
    this._pendingState = null;

    if (typeof pendingState !== 'undefined' && pendingState !== null)
    {
        this._pendingState = pendingState;
    }

    /**
    * @property {boolean} _clearWorld - Clear the world when we switch state?
    * @private
    */
    this._clearWorld = false;

    /**
    * @property {boolean} _clearCache - Clear the cache when we switch state?
    * @private
    */
    this._clearCache = false;

    /**
    * @property {boolean} _created - Flag that sets if the State has been created or not.
    * @private
    */
    this._created = false;

    /**
    * @property {array} _args - Temporary container when you pass vars from one State to another.
    * @private
    */
    this._args = [];

    /**
    * @property {string} current - The current active State object (defaults to null).
    */
    this.current = '';

    /**
    * @property {function} onInitCallback - This is called when the state is set as the active state.
    */
    this.onInitCallback = null;

    /**
    * @property {function} onPreloadCallback - This is called when the state starts to load assets.
    */
    this.onPreloadCallback = null;

    /**
    * @property {function} onCreateCallback - This is called when the state preload has finished and creation begins.
    */
    this.onCreateCallback = null;

    /**
    * @property {function} onUpdateCallback - This is called when the state is updated, every game loop. It doesn't happen during preload (@see onLoadUpdateCallback).
    */
    this.onUpdateCallback = null;

    /**
    * @property {function} onRenderCallback - This is called post-render. It doesn't happen during preload (see onLoadRenderCallback).
    */
    this.onRenderCallback = null;

    /**
    * @property {function} onResizeCallback - This is called if ScaleManager.scalemode is RESIZE and a resize event occurs. It's passed the new width and height.
    */
    this.onResizeCallback = null;

    /**
    * @property {function} onPreRenderCallback - This is called before the state is rendered and before the stage is cleared.
    */
    this.onPreRenderCallback = null;

    /**
    * @property {function} onLoadUpdateCallback - This is called when the State is updated during the preload phase.
    */
    this.onLoadUpdateCallback = null;

    /**
    * @property {function} onLoadRenderCallback - This is called when the State is rendered during the preload phase.
    */
    this.onLoadRenderCallback = null;

    /**
    * @property {function} onPausedCallback - This is called when the game is paused.
    */
    this.onPausedCallback = null;

    /**
    * @property {function} onResumedCallback - This is called when the game is resumed from a paused state.
    */
    this.onResumedCallback = null;

    /**
    * @property {function} onPauseUpdateCallback - This is called every frame while the game is paused.
    */
    this.onPauseUpdateCallback = null;

    /**
    * @property {function} onShutDownCallback - This is called when the state is shut down (i.e. swapped to another state).
    */
    this.onShutDownCallback = null;

};

Phaser.StateManager.prototype = {

    /**
    * The Boot handler is called by Phaser.Game when it first starts up.
    * @method Phaser.StateManager#boot
    * @private
    */
    boot: function () {

        // console.log('StateManager boot');

        this.game.onPause.add(this.pause, this);
        this.game.onResume.add(this.resume, this);
        this.game.load.onLoadComplete.add(this.loadComplete, this);

        if (this._pendingState !== null)
        {
            if (typeof this._pendingState !== 'string')
            {
                this.add('default', this._pendingState, true);
            }
        }

    },

    /**
    * Adds a new State into the StateManager. You must give each State a unique key by which you'll identify it.
    * The State can be either a Phaser.State object (or an object that extends it), a plain JavaScript object or a function.
    * If a function is given a new state object will be created by calling it.
    *
    * @method Phaser.StateManager#add
    * @param {string} key - A unique key you use to reference this state, i.e. "MainMenu", "Level1".
    * @param {Phaser.State|object|function} state  - The state you want to switch to.
    * @param {boolean} [autoStart=false]  - If true the State will be started immediately after adding it.
    */
    add: function (key, state, autoStart) {

        if (typeof autoStart === "undefined") { autoStart = false; }

        var newState;

        if (state instanceof Phaser.State)
        {
            newState = state;
        }
        else if (typeof state === 'object')
        {
            newState = state;
            newState.game = this.game;
        }
        else if (typeof state === 'function')
        {
            newState = new state(this.game);
        }

        this.states[key] = newState;

        if (autoStart)
        {
            if (this.game.isBooted)
            {
                this.start(key);
            }
            else
            {
                this._pendingState = key;
            }
        }

        return newState;

    },

    /**
    * Delete the given state.
    * @method Phaser.StateManager#remove
    * @param {string} key - A unique key you use to reference this state, i.e. "MainMenu", "Level1".
    */
    remove: function (key) {

        if (this.current === key)
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
            this.onResizeCallback = null;
            this.onPausedCallback = null;
            this.onResumedCallback = null;
            this.onPauseUpdateCallback = null;
        }

        delete this.states[key];

    },

    /**
    * Start the given State. If a State is already running then State.shutDown will be called (if it exists) before switching to the new State.
    *
    * @method Phaser.StateManager#start
    * @param {string} key - The key of the state you want to start.
    * @param {boolean} [clearWorld=true] - Clear everything in the world? This clears the World display list fully (but not the Stage, so if you've added your own objects to the Stage they will need managing directly)
    * @param {boolean} [clearCache=false] - Clear the Game.Cache? This purges out all loaded assets. The default is false and you must have clearWorld=true if you want to clearCache as well.
    * @param {...*} parameter - Additional parameters that will be passed to the State.init function (if it has one).
    */
    start: function (key, clearWorld, clearCache) {

        // console.log('-----------------------------------------------------------------------------------------');
        // console.log('START:', key);

        if (typeof clearWorld === "undefined") { clearWorld = true; }
        if (typeof clearCache === "undefined") { clearCache = false; }

        if (this.checkState(key))
        {
            //  Place the state in the queue. It will be started the next time the game loop starts.
            // console.log('set to pending', key);

            this._pendingState = key;
            this._clearWorld = clearWorld;
            this._clearCache = clearCache;

            if (arguments.length > 3)
            {
                this._args = Array.prototype.splice.call(arguments, 3);
            }
        }

    },

    /**
    * Restarts the current State. State.shutDown will be called (if it exists) before the State is restarted.
    *
    * @method Phaser.StateManager#restart
    * @param {boolean} [clearWorld=true] - Clear everything in the world? This clears the World display list fully (but not the Stage, so if you've added your own objects to the Stage they will need managing directly)
    * @param {boolean} [clearCache=false] - Clear the Game.Cache? This purges out all loaded assets. The default is false and you must have clearWorld=true if you want to clearCache as well.
    * @param {...*} parameter - Additional parameters that will be passed to the State.init function if it has one.
    */
    restart: function (clearWorld, clearCache) {

        if (typeof clearWorld === "undefined") { clearWorld = true; }
        if (typeof clearCache === "undefined") { clearCache = false; }

        //  Place the state in the queue. It will be started the next time the game loop starts.
        this._pendingState = this.current;
        this._clearWorld = clearWorld;
        this._clearCache = clearCache;

        if (arguments.length > 2)
        {
            this._args = Array.prototype.splice.call(arguments, 2);
        }

    },

    /**
    * Used by onInit and onShutdown when those functions don't exist on the state
    * @method Phaser.StateManager#dummy
    * @private
    */
    dummy: function () {
    },

    /**
    * preUpdate is called right at the start of the game loop. It is responsible for changing to a new state that was requested previously.
    *
    * @method Phaser.StateManager#preUpdate
    */
    preUpdate: function () {

        if (this._pendingState && this.game.isBooted)
        {
            // console.log('preUpdate - has pending:', this._pendingState, 'current:', this.current);

            //  Already got a state running?
            this.clearCurrentState();

            this.setCurrentState(this._pendingState);

            if (this.current !== this._pendingState)
            {
                // console.log('-> init called StateManager.start(', this._pendingState, ') so bail out');
                return;
            }
            else
            {
                this._pendingState = null;
                // console.log('pending nulled');
            }

            //  If StateManager.start has been called from the init of a State that ALSO has a preload, then
            //  onPreloadCallback will be set, but must be ignored
            if (this.onPreloadCallback)
            {
                // console.log('-> preload (', this.current, ')');

                this.game.load.reset();
                this.onPreloadCallback.call(this.callbackContext, this.game);

                //  Is the loader empty?
                if (this.game.load.totalQueuedFiles() === 0 && this.game.load.totalQueuedPacks() === 0)
                {
                    // console.log('loadComplete from empty preloader', this.current);
                    this.loadComplete();
                }
                else
                {
                    //  Start the loader going as we have something in the queue
                    // console.log('load start', this.current);
                    this.game.load.start();
                }
            }
            else
            {
                //  No init? Then there was nothing to load either
                // console.log('loadComplete from no preloader', this.current);
                this.loadComplete();
            }
        }

    },

    /**
    * This method clears the current State, calling its shutdown callback. The process also removes any active tweens,
    * resets the camera, resets input, clears physics, removes timers and if set clears the world and cache too.
    *
    * @method Phaser.StateManager#clearCurrentState
    */
    clearCurrentState: function () {

        // console.log('clearCurrentState', this.current);

        if (this.current)
        {
            // console.log('removing all', this.current);

            if (this.onShutDownCallback)
            {
                // console.log('-> shutdown (', this.current, ')');
                this.onShutDownCallback.call(this.callbackContext, this.game);
            }

            this.game.tweens.removeAll();

            this.game.camera.reset();

            this.game.input.reset(true);

            this.game.physics.clear();

            this.game.time.removeAll();

            this.game.scale.reset(this._clearWorld);

            if (this.game.debug)
            {
                this.game.debug.reset();
            }

            if (this._clearWorld)
            {
                this.game.world.shutdown();

                if (this._clearCache === true)
                {
                    this.game.cache.destroy();
                }
            }
        }

    },

    /**
    * Checks if a given phaser state is valid. A State is considered valid if it has at least one of the core functions: preload, create, update or render.
    *
    * @method Phaser.StateManager#checkState
    * @param {string} key - The key of the state you want to check.
    * @return {boolean} true if the State has the required functions, otherwise false.
    */
    checkState: function (key) {

        // console.log('checking', key);

        if (this.states[key])
        {
            var valid = false;

            if (this.states[key]['preload']) { valid = true; }
            if (this.states[key]['create']) { valid = true; }
            if (this.states[key]['update']) { valid = true; }
            if (this.states[key]['render']) { valid = true; }

            if (valid === false)
            {
                console.warn("Invalid Phaser State object given. Must contain at least a one of the required functions: preload, create, update or render");
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
    * Links game properties to the State given by the key.
    *
    * @method Phaser.StateManager#link
    * @param {string} key - State key.
    * @protected
    */
    link: function (key) {

        this.states[key].game = this.game;
        this.states[key].add = this.game.add;
        this.states[key].make = this.game.make;
        this.states[key].camera = this.game.camera;
        this.states[key].cache = this.game.cache;
        this.states[key].input = this.game.input;
        this.states[key].load = this.game.load;
        this.states[key].math = this.game.math;
        this.states[key].sound = this.game.sound;
        this.states[key].scale = this.game.scale;
        this.states[key].state = this;
        this.states[key].stage = this.game.stage;
        this.states[key].time = this.game.time;
        this.states[key].tweens = this.game.tweens;
        this.states[key].world = this.game.world;
        this.states[key].particles = this.game.particles;
        this.states[key].rnd = this.game.rnd;
        this.states[key].physics = this.game.physics;

    },

    /**
    * Nulls all State level Phaser properties, including a reference to Game.
    *
    * @method Phaser.StateManager#unlink
    * @param {string} key - State key.
    * @protected
    */
    unlink: function (key) {

        if (this.states[key])
        {
            this.states[key].game = null;
            this.states[key].add = null;
            this.states[key].make = null;
            this.states[key].camera = null;
            this.states[key].cache = null;
            this.states[key].input = null;
            this.states[key].load = null;
            this.states[key].math = null;
            this.states[key].sound = null;
            this.states[key].scale = null;
            this.states[key].state = null;
            this.states[key].stage = null;
            this.states[key].time = null;
            this.states[key].tweens = null;
            this.states[key].world = null;
            this.states[key].particles = null;
            this.states[key].rnd = null;
            this.states[key].physics = null;
        }

    },

    /**
    * Sets the current State. Should not be called directly (use StateManager.start)
    *
    * @method Phaser.StateManager#setCurrentState
    * @param {string} key - State key.
    * @private
    */
    setCurrentState: function (key) {

        // console.log('setCurrentState', key);

        this.callbackContext = this.states[key];

        this.link(key);

        //  Used when the state is set as being the current active state
        this.onInitCallback = this.states[key]['init'] || this.dummy;

        this.onPreloadCallback = this.states[key]['preload'] || null;
        this.onLoadRenderCallback = this.states[key]['loadRender'] || null;
        this.onLoadUpdateCallback = this.states[key]['loadUpdate'] || null;
        this.onCreateCallback = this.states[key]['create'] || null;
        this.onUpdateCallback = this.states[key]['update'] || null;
        this.onPreRenderCallback = this.states[key]['preRender'] || null;
        this.onRenderCallback = this.states[key]['render'] || null;
        this.onResizeCallback = this.states[key]['resize'] || null;
        this.onPausedCallback = this.states[key]['paused'] || null;
        this.onResumedCallback = this.states[key]['resumed'] || null;
        this.onPauseUpdateCallback = this.states[key]['pauseUpdate'] || null;

        //  Used when the state is no longer the current active state
        this.onShutDownCallback = this.states[key]['shutdown'] || this.dummy;

        this.current = key;
        this._created = false;

        //  At this point key and pendingState should equal each other
        // console.log('-> init (', key, ')', this._pendingState);

        this.onInitCallback.apply(this.callbackContext, this._args);

        //  If they no longer do then the init callback hit StateManager.start
        if (key === this._pendingState)
        {
            this._args = [];
        }

    },

    /**
     * Gets the current State.
     *
     * @method Phaser.StateManager#getCurrentState
     * @return Phaser.State
     * @public
     */
    getCurrentState: function() {
        return this.states[this.current];
    },

    /**
    * @method Phaser.StateManager#loadComplete
    * @protected
    */
    loadComplete: function () {

        // console.log('loadComplete');

        if (this._created === false && this.onCreateCallback)
        {
            // console.log('-> create (', this.current, ')');
            this._created = true;
            this.onCreateCallback.call(this.callbackContext, this.game);
        }
        else
        {
            this._created = true;
        }

    },

    /**
    * @method Phaser.StateManager#pause
    * @protected
    */
    pause: function () {

        if (this._created && this.onPausedCallback)
        {
            this.onPausedCallback.call(this.callbackContext, this.game);
        }

    },

    /**
    * @method Phaser.StateManager#resume
    * @protected
    */
    resume: function () {

        if (this._created && this.onResumedCallback)
        {
            this.onResumedCallback.call(this.callbackContext, this.game);
        }

    },

    /**
    * @method Phaser.StateManager#update
    * @protected
    */
    update: function () {

        if (this._created && this.onUpdateCallback)
        {
            this.onUpdateCallback.call(this.callbackContext, this.game);
        }
        else
        {
            if (this.onLoadUpdateCallback)
            {
                this.onLoadUpdateCallback.call(this.callbackContext, this.game);
            }
        }

    },

    /**
    * @method Phaser.StateManager#pauseUpdate
    * @protected
    */
    pauseUpdate: function () {

        if (this._created && this.onPauseUpdateCallback)
        {
            this.onPauseUpdateCallback.call(this.callbackContext, this.game);
        }
        else
        {
            if (this.onLoadUpdateCallback)
            {
                this.onLoadUpdateCallback.call(this.callbackContext, this.game);
            }
        }

    },

    /**
    * @method Phaser.StateManager#preRender
    * @protected
    */
    preRender: function () {

        if (this.onPreRenderCallback)
        {
            this.onPreRenderCallback.call(this.callbackContext, this.game);
        }

    },

    /**
    * @method Phaser.StateManager#resize
    * @protected
    */
    resize: function (width, height) {

        if (this.onResizeCallback)
        {
            this.onResizeCallback.call(this.callbackContext, width, height);
        }

    },

    /**
    * @method Phaser.StateManager#render
    * @protected
    */
    render: function () {

        if (this._created && this.onRenderCallback)
        {
            if (this.game.renderType === Phaser.CANVAS)
            {
                this.game.context.save();
                this.game.context.setTransform(1, 0, 0, 1, 0, 0);
            }

            this.onRenderCallback.call(this.callbackContext, this.game);

            if (this.game.renderType === Phaser.CANVAS)
            {
                this.game.context.restore();
            }
        }
        else
        {
            if (this.onLoadRenderCallback)
            {
                this.onLoadRenderCallback.call(this.callbackContext, this.game);
            }
        }

    },

    /**
    * Removes all StateManager callback references to the State object, nulls the game reference and clears the States object.
    * You don't recover from this without rebuilding the Phaser instance again.
    * @method Phaser.StateManager#destroy
    */
    destroy: function () {

        this.clearCurrentState();

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
        this.onResumedCallback = null;
        this.onPauseUpdateCallback = null;

        this.game = null;
        this.states = {};
        this._pendingState = null;

    }

};

Phaser.StateManager.prototype.constructor = Phaser.StateManager;
