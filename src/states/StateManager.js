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
Phaser.StateManager = function (game, pendingState)
{
    this.game = game;

    //  Everything kept in here
    this.keys = {};
    this.states = [];

    //  Only active states are kept in here
    this.active = [];

    this._pendingState = pendingState;
    this._pendingStart = [];
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

        if (this._pendingState !== null && typeof this._pendingState !== 'string')
        {
            this.add('default', this._pendingState, true);
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

        if (this.keys.hasOwnProperty(key))
        {
            throw new Error('Cannot add a State with duplicate key: ' + key);
        }

        //  if not booted, then do something else - put state into a holding pattern
        // if (this.game.isBooted)

        var newState;

        if (state instanceof Phaser.State)
        {
            console.log('add 1');
            newState = state;
        }
        else if (typeof state === 'object')
        {
            console.log('add 2');

            key = (state.hasOwnProperty('key')) ? state.key : 'default';

            newState = this.createStateFromObject(key, state);
        }
        else if (typeof state === 'function')
        {
            console.log('add 3');
            newState = new state(this.game);
        }

        this.keys[key] = newState;

        this.states.push(newState);

        window.state = newState;
        window.console.dir(newState);

        if (autoStart)
        {
            if (this.game.isBooted)
            {
                this.start(key);
            }
            else
            {
                this._pendingStart.push(key);
            }
        }
    },

    createStateFromObject: function (key, state)
    {
        var newState = new Phaser.State(this.game, key);

        //  Inject the default (non-optional) managers

        newState._sys.add = new Phaser.GameObject.Factory(this.game, newState);

        //  States have their own Loaders? Would make a lot of sense actually
        // newState._sys.load = this.game.load;

        newState._sys.transform = new Phaser.Component.Transform(newState);

        newState._sys.data = new Phaser.Component.Data(newState);

        newState._sys.color = new Phaser.Component.Color(newState);

        newState._sys.children = new Phaser.Component.Children(newState);

        //  Inject custom managers

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

        newState.preUpdate = (state.hasOwnProperty('preUpdate')) ? state.preUpdate : function () {};
        newState.update = (state.hasOwnProperty('update')) ? state.update : function () {};
        newState.postUpdate = (state.hasOwnProperty('postUpdate')) ? state.postUpdate : function () {};
        newState.render = (state.hasOwnProperty('render')) ? state.render : function () {};

        //  Settings?

        if (state.hasOwnProperty('x'))
        {
            newState.settings.x = state.x;
        }

        if (state.hasOwnProperty('y'))
        {
            newState.settings.y = state.y;
        }

        if (state.hasOwnProperty('width'))
        {
            newState.settings.width = state.width;
        }

        if (state.hasOwnProperty('height'))
        {
            newState.settings.height = state.height;
        }

        //  WebGL?
        if (this.game.renderType === Phaser.WEBGL)
        {
            var x = newState.settings.x;
            var y = newState.settings.y;
            var width = newState.settings.width;
            var height = newState.settings.height;

            newState._sys.fbo = new Phaser.Renderer.WebGL.QuadFBO(this.game.renderer, x, y, width, height);
        }

        return newState;
    },

    getState: function (key)
    {
        return this.keys[key];
    },

    start: function (key)
    {
        var state = this.getState(key);

        if (state && !state.settings.active)
        {
            state.settings.active = true;

            this.active.push(state);

            //  + arguments
            if (state.init)
            {
                state.init.call(state);
            }

            if (state.preload)
            {
                this.game.load.reset(true);

                state.preload.call(state, this.game);

                //  Is the loader empty?
                if (this.game.load.totalQueuedFiles() === 0 && this.game.load.totalQueuedPacks() === 0)
                {
                    console.log('empty queue');
                    this.startCreate(state);
                }
                else
                {
                    console.log('load start');

                    //  Start the loader going as we have something in the queue
                    this.game.load.onLoadComplete.addOnce(this.loadComplete, this, 0, state);

                    this.game.load.start();
                }
            }
            else
            {
                console.log('no preload');

                //  No preload? Then there was nothing to load either
                this.startCreate(state);
            }

        }
    },

    loadComplete: function (state)
    {
        console.log('loadComplete');
        // console.log(arguments);
        console.log(state);

        //  Make sure to do load-update one last time before state is set to _created

        if (state.hasOwnProperty('loadUpdate'))
        {
            state.loadUpdate.call(state);
        }

        this.startCreate(state);

        // if (this._created === false && this.onLoadUpdateCallback)
        // {
        //     this.onLoadUpdateCallback.call(this.callbackContext, this.game);
        // }

        // if (this._created === false && this.onCreateCallback)
        // {
        //     this._created = true;
        //     this.onCreateCallback.call(this.callbackContext, this.game);
        //     this.game.updates.running = true;
        // }
        // else
        // {
        //     this._created = true;
        // }

    },

    startCreate: function (state)
    {
        if (state.create)
        {
            state.create.call(state);
        }

        this.game.updates.running = true;
    },

    //  See if we can reduce this down to just update and render

    preUpdate: function ()
    {
        for (var i = 0; i < this.active.length; i++)
        {
            var state = this.active[i];

            for (var c = 0; c < state._sys.children.list.length; c++)
            {
                state._sys.children.list[c].preUpdate();
            }

            state.preUpdate();
        }
    },

    update: function ()
    {
        for (var i = 0; i < this.active.length; i++)
        {
            var state = this.active[i];

            for (var c = 0; c < state._sys.children.list.length; c++)
            {
                var child = state._sys.children.list[c];

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

            for (var c = 0; c < state._sys.children.list.length; c++)
            {
                state._sys.children.list[c].postUpdate();
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
            if (!state.settings.visible || state._sys.color.alpha === 0 || state._sys.children.list.length === 0)
            {
                continue;
            }

            this.game.renderer.render(state);
        }
    },

    renderChildren: function (renderer, state)
    {
        //  Populates the display list
        for (var c = 0; c < state._sys.children.list.length; c++)
        {
            var child = state._sys.children.list[c];

            child.render(renderer, child);
        }
    }

};
