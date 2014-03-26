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
    * @property {function} onInitCallback - This will be called when the state is started (i.e. set as the current active state).
    */
    this.onInitCallback = null;

    /**
    * @property {function} onPreloadCallback - This will be called when init states (loading assets...).
    */
    this.onPreloadCallback = null;

    /**
    * @property {function} onCreateCallback - This will be called when create states (setup states...).
    */
    this.onCreateCallback = null;

    /**
    * @property {function} onUpdateCallback - This will be called when State is updated, this doesn't happen during load (@see onLoadUpdateCallback).
    */
    this.onUpdateCallback = null;

    /**
    * @property {function} onRenderCallback - This will be called when the State is rendered, this doesn't happen during load (see onLoadRenderCallback).
    */
    this.onRenderCallback = null;

    /**
    * @property {function} onPreRenderCallback - This will be called before the State is rendered and before the stage is cleared.
    */
    this.onPreRenderCallback = null;

    /**
    * @property {function} onLoadUpdateCallback - This will be called when the State is updated but only during the load process.
    */
    this.onLoadUpdateCallback = null;

    /**
    * @property {function} onLoadRenderCallback - This will be called when the State is rendered but only during the load process.
    */
    this.onLoadRenderCallback = null;

    /**
    * @property {function} onPausedCallback - This will be called when the state is paused.
    */
    this.onPausedCallback = null;

    /**
    * @property {function} onResumedCallback - This will be called when the state is resumed from a paused state.
    */
    this.onResumedCallback = null;

    /**
    * @property {function} onShutDownCallback - This will be called when the state is shut down (i.e. swapped to another state).
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

        this.game.onPause.add(this.pause, this);
        this.game.onResume.add(this.resume, this);
        this.game.load.onLoadComplete.add(this.loadComplete, this);

        if (this._pendingState !== null)
        {
            if (typeof this._pendingState === 'string')
            {
                //  State was already added, so just start it
                this.start(this._pendingState, false, false);
            }
            else
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
            this.onResumedCallback = null;
            this.onDestroyCallback = null;
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

        if (typeof clearWorld === "undefined") { clearWorld = true; }
        if (typeof clearCache === "undefined") { clearCache = false; }

        if (this.checkState(key))
        {
            //  Place the state in the queue. It will be started the next time the game loop starts.
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
            //  Already got a state running?
            if (this.current)
            {
                this.onShutDownCallback.call(this.callbackContext, this.game);

                this.game.tweens.removeAll();

                this.game.camera.reset();

                this.game.input.reset(true);

                this.game.physics.clear();

                this.game.time.removeAll();

                if (this._clearWorld)
                {
                    this.game.world.shutdown();

                    if (this._clearCache === true)
                    {
                        this.game.cache.destroy();
                    }
                }
            }

            this.setCurrentState(this._pendingState);

            if (this.onPreloadCallback)
            {
                this.game.load.reset();
                this.onPreloadCallback.call(this.callbackContext, this.game);

                //  Is the loader empty?
                if (this.game.load.totalQueuedFiles() === 0)
                {
                    this.loadComplete();
                }
                else
                {
                    //  Start the loader going as we have something in the queue
                    this.game.load.start();
                }
            }
            else
            {
                //  No init? Then there was nothing to load either
                this.loadComplete();
            }

            if (this.current === this._pendingState)
            {
                this._pendingState = null;
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
    * Sets the current State. Should not be called directly (use StateManager.start)
    * @method Phaser.StateManager#setCurrentState
    * @param {string} key - State key.
    * @private
    */
    setCurrentState: function (key) {

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
        this.onPausedCallback = this.states[key]['paused'] || null;
        this.onResumedCallback = this.states[key]['resumed'] || null;

        //  Used when the state is no longer the current active state
        this.onShutDownCallback = this.states[key]['shutdown'] || this.dummy;

        this.current = key;
        this._created = false;

        this.onInitCallback.apply(this.callbackContext, this._args);

        this._args = [];

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

        if (this._created === false && this.onCreateCallback)
        {
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
    * Nuke the entire game from orbit
    * @method Phaser.StateManager#destroy
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
        this.onResumedCallback = null;
        this.onDestroyCallback = null;

        this.game = null;
        this.states = {};
        this._pendingState = null;

    }

};

Phaser.StateManager.prototype.constructor = Phaser.StateManager;
