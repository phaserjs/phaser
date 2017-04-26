/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var CONST = require('../const');
var NOOP = require('../utils/NOOP');
var State = require('./State');
var Systems = require('./Systems');
var GetValue = require('../utils/object/GetValue');
var EventDispatcher = require('../events/EventDispatcher');
var Rectangle = require('../geom/rectangle/Rectangle');
var CanvasPool = require('../dom/CanvasPool');
var CanvasInterpolation = require('../dom/CanvasInterpolation');
var GetContext = require('../canvas/GetContext');

/**
* The State Manager is responsible for loading, setting up and switching game states.
*
* @class Phaser.GlobalStateManager
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
var GlobalStateManager = function (game, stateConfig)
{
    this.game = game;

    //  Everything kept in here
    this.keys = {};
    this.states = [];

    //  Only active states are kept in here
    this.active = [];

    this._pending = [];

    if (stateConfig)
    {
        if (Array.isArray(stateConfig))
        {
            for (var i = 0; i < stateConfig.length; i++)
            {
                //  The i === 0 part just starts the first State given
                this._pending.push({
                    index: i,
                    key: 'default',
                    state: stateConfig[i],
                    autoStart: (i === 0),
                    data: {}
                });
            }
        }
        else
        {
            this._pending.push({
                index: 0,
                key: 'default',
                state: stateConfig,
                autoStart: true,
                data: {}
            });
        }
    }
};

GlobalStateManager.prototype.constructor = GlobalStateManager;

GlobalStateManager.prototype = {

    /**
    * The Boot handler is called by Phaser.Game when it first starts up.
    * The renderer is available by now.
    *
    * @method Phaser.GlobalStateManager#boot
    * @private
    */
    boot: function ()
    {
        for (var i = 0; i < this._pending.length; i++)
        {
            var entry = this._pending[i];

            this.add(entry.key, entry.state, entry.autoStart);
        }

        //  Clear the pending list
        this._pending = [];
    },

    //  private
    getKey: function (key, stateConfig)
    {
        if (!key) { key = 'default'; }

        if (stateConfig instanceof State)
        {
            key = stateConfig.settings.key;
        }
        else if (typeof stateConfig === 'object' && stateConfig.hasOwnProperty('key'))
        {
            key = stateConfig.key;
        }

        //  By this point it's either 'default' or extracted from the State

        if (this.keys.hasOwnProperty(key))
        {
            throw new Error('Cannot add a State with duplicate key: ' + key);
        }
        else
        {
            return key;
        }
    },

    /**
    * Adds a new State into the GlobalStateManager. You must give each State a unique key by which you'll identify it.
    * The State can be either a Phaser.State object (or an object that extends it), a plain JavaScript object or a function.
    * If a function is given a new state object will be created by calling it.
    *
    * @method Phaser.GlobalStateManager#add
    * @param {string} key - A unique key you use to reference this state, i.e. "MainMenu", "Level1".
    * @param {Phaser.State|object|function} state  - The state you want to switch to.
    * @param {boolean} [autoStart=false]  - If true the State will be started immediately after adding it.
    */
    add: function (key, stateConfig, autoStart)
    {
        if (autoStart === undefined) { autoStart = false; }

        //  if not booted, then put state into a holding pattern
        if (!this.game.isBooted)
        {
            this._pending.push({
                index: this._pending.length,
                key: key,
                state: stateConfig,
                autoStart: autoStart
            });

            console.log('GlobalStateManager not yet booted, adding to list', this._pending.length);

            return;
        }

        key = this.getKey(key, stateConfig);

        // console.log('GlobalStateManager.add', key, stateConfig, autoStart);

        var newState;

        if (stateConfig instanceof State)
        {
            // console.log('GlobalStateManager.add from instance:', key);
            newState = this.createStateFromInstance(key, stateConfig);
        }
        else if (typeof stateConfig === 'object')
        {
            // console.log('GlobalStateManager.add from object:', key);

            stateConfig.key = key;

            newState = this.createStateFromObject(key, stateConfig);
        }
        else if (typeof stateConfig === 'function')
        {
            // console.log('GlobalStateManager.add from function:', key);

            newState = this.createStateFromFunction(key, stateConfig);
        }

        this.keys[key] = newState;

        this.states.push(newState);

        if (autoStart || newState.settings.active)
        {
            if (this.game.isBooted)
            {
                this.start(key);
            }
            else
            {
                this._start.push(key);
            }
        }

        return newState;
    },

    createStateFromInstance: function (key, newState)
    {
        newState.settings.key = key;

        newState.sys.init(this.game);

        this.createStateDisplay(newState);

        return newState;
    },

    createStateFromObject: function (key, stateConfig)
    {
        var newState = new State(stateConfig);

        newState.sys.init(this.game);

        this.createStateDisplay(newState);

        return this.setupCallbacks(newState, stateConfig);
    },

    createStateFromFunction: function (key, state)
    {
        var newState = new state();

        if (newState instanceof State)
        {
            return this.createStateFromInstance(key, newState);
        }
        else
        {
            newState.sys = new Systems(newState);

            newState.sys.init(this.game);

            this.createStateDisplay(newState);

            //  Default required functions

            if (!newState.init)
            {
                newState.init = NOOP;
            }

            if (!newState.preload)
            {
                newState.preload = NOOP;
            }

            if (!newState.create)
            {
                newState.create = NOOP;
            }

            if (!newState.shutdown)
            {
                newState.shutdown = NOOP;
            }

            if (!newState.update)
            {
                newState.update = NOOP;
            }

            if (!newState.render)
            {
                newState.render = NOOP;
            }

            return newState;
        }
    },

    setupCallbacks: function (state, stateConfig)
    {
        if (stateConfig === undefined) { stateConfig = state; }

        //  Extract callbacks or set NOOP

        state.init = GetValue(stateConfig, 'init', NOOP);
        state.preload = GetValue(stateConfig, 'preload', NOOP);
        state.create = GetValue(stateConfig, 'create', NOOP);
        state.shutdown = GetValue(stateConfig, 'shutdown', NOOP);

        //  Game Loop level callbacks

        state.update = GetValue(stateConfig, 'update', NOOP);
        state.render = GetValue(stateConfig, 'render', NOOP);

        return state;
    },

    createStateDisplay: function (state)
    {
        // console.log('createStateDisplay', state.settings.key);

        var settings = state.sys.settings;

        // var x = settings.x;
        // var y = settings.y;
        var width = settings.width;
        var height = settings.height;

        var config = this.game.config;

        if (config.renderType === CONST.CANVAS)
        {
            if (settings.renderToTexture)
            {
                // console.log('renderToTexture', width, height);
                state.sys.canvas = CanvasPool.create(state, width, height);
                state.sys.context = GetContext(state.sys.canvas);

                //  Pixel Art mode?
                if (config.pixelArt)
                {
                    CanvasInterpolation.setCrisp(state.sys.canvas);
                }
            }
            else
            {
                // console.log('using game canvas');
                state.sys.mask = new Rectangle(0, 0, width, height);
                state.sys.canvas = this.game.canvas;
                state.sys.context = this.game.context;
            }
        }
        else if (config.renderType === CONST.WEBGL)
        {
            // state.sys.fbo = this.game.renderer.createFBO(state, x, y, width, height);
        }
    },

    getState: function (key)
    {
        return this.keys[key];
    },

    getStateIndex: function (state)
    {
        return this.states.indexOf(state);
    },

    getActiveStateIndex: function (state)
    {
        var index = -1;

        for (var i = 0; i < this.active.length; i++)
        {
            if (this.active[i].state === state)
            {
                index = this.active[i].index;
            }
        }

        return index;
    },

    isActive: function (key)
    {
        var state = this.getState(key);

        return (state && state.settings.active && this.active.indexOf(state) !== -1);
    },

    start: function (key, data)
    {
        if (data === undefined) { data = {}; }

        // console.log('start:', key);
        // console.dir(data);

        //  if not booted, then put state into a holding pattern
        if (!this.game.isBooted)
        {
            // console.log('GlobalStateManager not yet booted, setting autoStart on pending list');

            for (var i = 0; i < this._pending.length; i++)
            {
                var entry = this._pending[i];

                if (entry.key === key)
                {
                    entry.autoStart = true;
                    entry.data = data;
                }
            }

            return;
        }

        var state = this.getState(key);

        if (state)
        {
            //  Already started? Nothing more to do here ...
            if (this.isActive(key))
            {
                return;
            }

            state.settings.active = true;

            state.settings.data = data;

            var loader = state.sys.load;

            //  Files payload?
            if (loader && Array.isArray(state.sys.settings.files))
            {
                loader.reset();

                if (loader.loadArray(state.sys.settings.files))
                {
                    loader.events.once('LOADER_COMPLETE_EVENT', this.payloadComplete.bind(this));

                    loader.start();
                }
                else
                {
                    this.bootState(state);
                }
            }
            else
            {
                this.bootState(state);
            }
        }
    },

    payloadComplete: function (event)
    {
        var state = event.loader.state;

        // console.log('payloadComplete', state.sys.settings.key);

        this.bootState(state);
    },

    bootState: function (state)
    {
        // console.log('bootState', state.sys.settings.key);

        if (state.init)
        {
            state.init.call(state, state.sys.settings.data);
        }

        var loader = state.sys.load;
            
        loader.reset();

        if (state.preload)
        {
            state.preload(this.game);

            //  Is the loader empty?
            if (loader.list.size === 0)
            {
                this.create(state);
            }
            else
            {
                //  Start the loader going as we have something in the queue

                loader.events.once('LOADER_COMPLETE_EVENT', this.loadComplete.bind(this));

                loader.start();
            }
        }
        else
        {
            //  No preload? Then there was nothing to load either
            this.create(state);
        }
    },

    loadComplete: function (event)
    {
        var state = event.loader.state;

        // console.log('loadComplete', state.sys.settings.key);

        this.create(state);
    },

    create: function (state)
    {
        // console.log('create', state.sys.settings.key);
        // console.log(state);

        //  Insert at the correct index, or it just all goes wrong :)

        var i = this.getStateIndex(state);

        // console.log('create.index', state.sys.settings.key, i);

        this.active.push({ index: i, state: state });

        //  Sort the 'active' array based on the index property
        this.active.sort(this.sortStates);

        state.sys.updates.running = true;

        if (state.create)
        {
            state.create.call(state, state.sys.settings.data);
        }
    },

    pause: function (key)
    {
        var index = this.getActiveStateIndex(this.getState(key));

        if (index > -1)
        {
            var state = this.getState(key);

            state.settings.active = false;

            this.active.splice(index, 1);

            this.active.sort(this.sortStates);
        }
    },

    sortStates: function (stateA, stateB)
    {
        // console.log('sortStates', stateA.state.sys.settings.key, stateA.index, stateB.state.sys.settings.key, stateB.index);

        //  Sort descending
        if (stateA.index < stateB.index)
        {
            return -1;
        }
        else if (stateA.index > stateB.index)
        {
            return 1;
        }
        else
        {
            return 0;
        }
    }

};

module.exports = GlobalStateManager;
