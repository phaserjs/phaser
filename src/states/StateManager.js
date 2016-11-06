/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The State Manager is responsible for loading, setting up and switching game states.
*
* @class Phaser.StateManager
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.StateManager = function (game, pending)
{
    this.game = game;

    //  Everything kept in here
    this.keys = {};
    this.states = [];

    //  Only active states are kept in here
    this.active = [];

    this._pending = [];

    if (pending)
    {
        if (Array.isArray(pending))
        {
            for (var i = 0; i < pending.length; i++)
            {
                //  The i === 0 part just starts the first State given
                this._pending.push({ key: 'default', state: pending[i], autoStart: (i === 0) });
            }
        }
        else
        {
            this._pending.push({ key: 'default', state: pending, autoStart: true });
        }
    }
};

Phaser.StateManager.prototype = {

    /**
    * The Boot handler is called by Phaser.Game when it first starts up.
    * The renderer is available by now.
    *
    * @method Phaser.StateManager#boot
    * @private
    */
    boot: function ()
    {
        // this.game.onPause.add(this.pause, this);
        // this.game.onResume.add(this.resume, this);

        console.log('StateManager.boot');

        for (var i = 0; i < this._pending.length; i++)
        {
            var entry = this._pending[i];

            this.add(entry.key, entry.state, entry.autoStart);
        }

        this._pending = [];
    },

    getKey: function (key, state)
    {
        if (!key) { key = 'default'; }

        if (state instanceof Phaser.State)
        {
            key = state.settings.key;
        }
        else if (typeof state === 'object' && state.hasOwnProperty('key'))
        {
            key = state.key;
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
    * Adds a new State into the StateManager. You must give each State a unique key by which you'll identify it.
    * The State can be either a Phaser.State object (or an object that extends it), a plain JavaScript object or a function.
    * If a function is given a new state object will be created by calling it.
    *
    * @method Phaser.StateManager#add
    * @param {string} key - A unique key you use to reference this state, i.e. "MainMenu", "Level1".
    * @param {Phaser.State|object|function} state  - The state you want to switch to.
    * @param {boolean} [autoStart=false]  - If true the State will be started immediately after adding it.
    */
    add: function (key, state, autoStart)
    {
        if (autoStart === undefined) { autoStart = false; }

        //  if not booted, then put state into a holding pattern
        if (!this.game.isBooted)
        {
            console.log('StateManager not yet booted, adding to list');

            this._pending.push({ key: key, state: state, autoStart: autoStart });

            return;
        }

        key = this.getKey(key, state);

        var newState;

        if (state instanceof Phaser.State)
        {
            console.log('StateManager.add from instance', key);
            newState = this.createStateFromInstance(key, state);
        }
        else if (typeof state === 'object')
        {
            console.log('StateManager.add from object', key);
            newState = this.createStateFromObject(key, state);
        }
        else if (typeof state === 'function')
        {
            console.log('StateManager.add from function', key);
            newState = this.createStateFromFunction(key, state);
        }

        this.keys[key] = newState;

        this.states.push(newState);

        // window.console.dir(newState);

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
        newState.game = this.game;

        newState.settings.key = key;

        newState.sys.init();

        if (this.game.renderType === Phaser.WEBGL)
        {
            this.createStateFrameBuffer(newState);
        }

        return newState;
    },

    createStateFromObject: function (key, state)
    {
        var newState = new Phaser.State(key);

        newState.game = this.game;

        newState.sys.init();

        if (this.game.renderType === Phaser.WEBGL)
        {
            this.createStateFrameBuffer(newState);
        }

        //  Extract callbacks or set NOOP

        if (state.hasOwnProperty('init'))
        {
            newState.init = state.init;
        }

        if (state.hasOwnProperty('preload'))
        {
            newState.preload = state.preload;
        }

        if (state.hasOwnProperty('create'))
        {
            newState.create = state.create;
        }

        if (state.hasOwnProperty('shutdown'))
        {
            newState.shutdown = state.shutdown;
        }

        newState.preUpdate = (state.hasOwnProperty('preUpdate')) ? state.preUpdate : Phaser.NOOP;
        newState.update = (state.hasOwnProperty('update')) ? state.update : Phaser.NOOP;
        newState.postUpdate = (state.hasOwnProperty('postUpdate')) ? state.postUpdate : Phaser.NOOP;
        newState.render = (state.hasOwnProperty('render')) ? state.render : Phaser.NOOP;

        return newState;
    },

    createStateFromFunction: function (key, state)
    {
        var newState = new state();

        if (newState instanceof Phaser.State)
        {
            return this.createStateFromInstance(key, newState);
        }
        else
        {
            newState.game = this.game;

            newState.settings = new Phaser.State.Settings(newState, key);

            newState.sys = new Phaser.State.Systems(newState);

            newState.sys.init();

            if (this.game.renderType === Phaser.WEBGL)
            {
                this.createStateFrameBuffer(newState);
            }

            //  Default required functions

            if (!newState.preUpdate)
            {
                newState.preUpdate = Phaser.NOOP;
            }

            if (!newState.update)
            {
                newState.update = Phaser.NOOP;
            }

            if (!newState.postUpdate)
            {
                newState.postUpdate = Phaser.NOOP;
            }

            if (!newState.render)
            {
                newState.render = Phaser.NOOP;
            }

            return newState;
        }
    },

    createStateFrameBuffer: function (newState)
    {
        var x = newState.settings.x;
        var y = newState.settings.y;

        if (newState.settings.width === -1)
        {
            newState.settings.width = this.game.width;
        }

        if (newState.settings.height === -1)
        {
            newState.settings.height = this.game.height;
        }

        var width = newState.settings.width;
        var height = newState.settings.height;

        newState.sys.fbo = this.game.renderer.createFBO(x, y, width, height);
    },

    getState: function (key)
    {
        return this.keys[key];
    },

    isActive: function (key)
    {
        var state = this.getState(key);

        return (state && state.settings.active && this.active.indexOf(state) !== -1);
    },

    start: function (key)
    {
        //  if not booted, then put state into a holding pattern
        if (!this.game.isBooted)
        {
            console.log('StateManager not yet booted, setting autoStart on pending list');

            for (var i = 0; i < this._pending.length; i++)
            {
                var entry = this._pending[i];

                if (entry.key === key)
                {
                    entry.autoStart = true;
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

            //  + arguments
            if (state.init)
            {
                state.init.call(state);
            }

            if (state.preload)
            {
                state.sys.load.reset(true);

                state.preload.call(state, this.game);

                //  Is the loader empty?
                if (state.sys.load.totalQueuedFiles() === 0 && state.sys.load.totalQueuedPacks() === 0)
                {
                    // console.log('empty queue');
                    this.startCreate(state);
                }
                else
                {
                    // console.log('load start');

                    //  Start the loader going as we have something in the queue
                    // state.load.onLoadComplete.addOnce(this.loadComplete, this, 0, state);

                    state.sys.load.start();
                }
            }
            else
            {
                // console.log('no preload');

                //  No preload? Then there was nothing to load either
                this.startCreate(state);
            }

        }
    },

    loadComplete: function (state)
    {
        // console.log('loadComplete');

        //  Make sure to do load-update one last time before state is set to _created

        if (state.hasOwnProperty('loadUpdate'))
        {
            state.loadUpdate.call(state);
        }

        this.startCreate(state);
    },

    startCreate: function (state)
    {
        if (state.create)
        {
            state.create.call(state);
        }

        this.active.push(state);

        this.game.updates.running = true;
    },

    //  See if we can reduce this down to just update and render

    preUpdate: function ()
    {
        for (var i = 0; i < this.active.length; i++)
        {
            var state = this.active[i];

            for (var c = 0; c < state.sys.children.list.length; c++)
            {
                state.sys.children.list[c].preUpdate();
            }

            state.preUpdate();
        }
    },

    update: function ()
    {
        for (var i = 0; i < this.active.length; i++)
        {
            var state = this.active[i];

            //  Invoke State Main Loop here - updating all of its systems (tweens, physics, etc)

            //  This shouldn't be called if the State is still loading
            //  Have a State.STATUS const in the Settings, dictating what is going on

            for (var c = 0; c < state.sys.children.list.length; c++)
            {
                var child = state.sys.children.list[c];

                if (child.exists)
                {
                    child.update();
                }
            }

            state.update();
        }
    },

    postUpdate: function ()
    {
        for (var i = 0; i < this.active.length; i++)
        {
            var state = this.active[i];

            for (var c = 0; c < state.sys.children.list.length; c++)
            {
                state.sys.children.list[c].postUpdate();
            }

            state.postUpdate();
        }
    },

    render: function ()
    {
        for (var i = 0; i < this.active.length; i++)
        {
            var state = this.active[i];

            //  Can put all kinds of other checks in here, like MainLoop, FPS, etc.
            if (!state.settings.visible || state.sys.color.alpha === 0 || state.sys.children.list.length === 0)
            {
                continue;
            }

            this.game.renderer.render(state);
        }
    },

    renderChildren: function (renderer, state)
    {
        //  Populates the display list
        for (var c = 0; c < state.sys.children.list.length; c++)
        {
            var child = state.sys.children.list[c];

            child.render(renderer, child);
        }
    }

};
