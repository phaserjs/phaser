
var CameraManager = require('../plugins/CameraManager');
var Class = require('../utils/Class');
var Clock = require('../time/Clock');
var Data = require('../plugins/Data');
var DisplayList = require('../plugins/DisplayList');
var EventDispatcher = require('../events/EventDispatcher');
var GameObjectCreator = require('../plugins/GameObjectCreator');
var GameObjectFactory = require('../plugins/GameObjectFactory');
var Loader = require('../plugins/Loader');
var Settings = require('./Settings');
var StableSort = require('../utils/array/StableSort');
var StateManager = require('../plugins/StateManager');
var TweenManager = require('../tween/TweenManager');
var UpdateList = require('../plugins/UpdateList');

var Systems = new Class({

    initialize:

    function Systems (state, config)
    {
        this.state = state;

        this.config = config;
        this.settings = Settings.create(config);

        this.sortChildrenFlag = false;

        //  Set by the GlobalStateManager
        this.mask = null;
        this.canvas;
        this.context;

        //  CORE (GLOBAL) SYSTEMS / PROPERTIES

        this.game;

        this.anims;
        this.cache;
        this.input;
        this.registry;
        this.textures;

        //  Reference to State specific managers (Factory, Tweens, Loader, Physics, etc)
        this.add;
        this.cameras;
        this.events;
        this.load;
        this.make;
        this.stateManager;
        this.time;
        this.tweens;

        //  State properties
        this.updateList;
        this.displayList;
        this.data;
    },

    init: function (game)
    {
        var state = this.state;

        this.game = game;

        //  Game (Global) level managers

        this.anims = game.anims;
        this.cache = game.cache;
        this.input = game.input;
        this.registry = game.registry;
        this.textures = game.textures;

        //  State specific properties (transform, data, children, etc)

        this.updateList = new UpdateList(state);
        this.displayList = new DisplayList(state);
        this.data = new Data(state);

        //  State specific managers (Factory, Tweens, Loader, Physics, etc)

        this.add = new GameObjectFactory(state);
        this.cameras = new CameraManager(state);
        this.events = new EventDispatcher();
        this.load = new Loader(state);
        this.make = new GameObjectCreator(state);
        this.stateManager = new StateManager(state, game);
        this.time = new Clock(state);
        this.tweens = new TweenManager(state);

        this.inject();
    },

    inject: function ()
    {
        var map = this.settings.map;

        for (var key in map)
        {
            if (key === 'sys')
            {
                continue;
            }

            this.state[map[key]] = this[key];
        }
    },

    step: function (time, delta)
    {
        //  Are there any pending StateManager actions?
        this.stateManager.update();

        if (!this.settings.active)
        {
            return;
        }

        this.updateList.begin();
        this.time.begin(time);
        this.tweens.begin(time);

        this.updateList.update(time, delta);
        this.time.update(time, delta);
        this.tweens.update(time, delta);
        this.cameras.update(time, delta);

        this.state.update.call(this.state, time, delta);
    },

    render: function (interpolation, renderer)
    {
        if (!this.settings.visible)
        {
            return;
        }

        if (this.sortChildrenFlag)
        {
            StableSort.inplace(this.displayList.list, this.sortZ);

            this.sortChildrenFlag = false;
        }

        this.cameras.render(renderer, this.displayList, interpolation);
    },

    sortZ: function (childA, childB)
    {
        return childA._z - childB._z;
    },

    //  A paused State still renders, it just doesn't run ANY of its update handlers or systems
    pause: function ()
    {
        //  Was paused by the GlobalStateManager

        this.settings.active = false;

        if (this.state.pause)
        {
            this.state.pause.call(this.state);
        }
    },

    resume: function ()
    {
        //  Was resumed by the GlobalStateManager

        this.settings.active = true;

        if (this.state.resume)
        {
            this.state.resume.call(this.state);
        }
    },

    sleep: function ()
    {
        //  Was sent to sleep by the GlobalStateManager

        this.settings.active = false;
        this.settings.visible = false;

        if (this.state.sleep)
        {
            this.state.sleep.call(this.state);
        }
    },

    wake: function ()
    {
        //  Was woken up by the GlobalStateManager

        this.settings.active = true;
        this.settings.visible = true;

        if (this.state.wake)
        {
            this.state.wake.call(this.state);
        }
    },

    start: function (data)
    {
        //  Was started by the GlobalStateManager

        this.settings.data = data;

        this.settings.active = true;
        this.settings.visible = true;
    },

    shutdown: function ()
    {
        //  Was stopped by the GlobalStateManager

        this.settings.active = false;
        this.settings.visible = false;

        this.displayList.shutdown();
        this.updateList.shutdown();
        this.time.shutdown();
        this.tweens.shutdown();

        if (this.state.shutdown)
        {
            this.state.shutdown.call(this.state);
        }
    },

    //  Game level nuke
    destroy: function ()
    {
        //  TODO

        this.time.destroy();
        this.tweens.destroy();

        //  etc
        if (this.state.destroy)
        {
            this.state.destroy.call(this.state);
        }
    }

});

module.exports = Systems;
