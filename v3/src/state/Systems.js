
var CameraManager = require('./systems/CameraManager');
var Clock = require('../time/Clock');
var Component = require('../components');
var EventDispatcher = require('../events/EventDispatcher');
var GameObjectCreator = require('./systems/GameObjectCreator');
var GameObjectFactory = require('./systems/GameObjectFactory');
var Loader = require('./systems/Loader');
var Settings = require('./Settings');
var StableSort = require('../utils/array/StableSort');
var StateManager = require('./systems/StateManager');
var TweenManager = require('../tween/TweenManager');
var UpdateManager = require('./systems/UpdateManager');

var Systems = function (state, config)
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
    this.updates;

    //  State properties
    this.children;
    this.color;
    this.data;
};

Systems.prototype.constructor = Systems;

Systems.prototype = {

    init: function (game)
    {
        this.game = game;

        //  Game (Global) level managers

        this.anims = this.game.anims;
        this.cache = this.game.cache;
        this.input = this.game.input;
        this.registry = this.game.registry;
        this.textures = this.game.textures;

        //  State specific properties (transform, data, children, etc)

        this.children = new Component.Children(this.state);
        this.color = new Component.Color(this.state);
        this.data = new Component.Data(this.state);

        //  State specific managers (Factory, Tweens, Loader, Physics, etc)

        this.add = new GameObjectFactory(this.state);
        this.cameras = new CameraManager(this.state);
        this.events = new EventDispatcher();
        this.load = new Loader(this.state);
        this.make = new GameObjectCreator(this.state);
        this.stateManager = new StateManager(this.state, game);
        this.time = new Clock(this.state);
        this.tweens = new TweenManager(this.state);
        this.updates = new UpdateManager(this.state);

        this.inject();
    },

    inject: function ()
    {
        //  Defaults properties injected into the State

        this.state.game = this.game;

        this.state.anims = this.anims;
        this.state.cache = this.cache;
        this.state.input = this.input;
        this.state.registry = this.registry;
        this.state.textures = this.textures;

        this.state.add = this.add;
        this.state.cameras = this.cameras;
        this.state.events = this.events;
        this.state.load = this.load;
        this.state.make = this.make;
        this.state.state = this.stateManager;
        this.state.time = this.time;
        this.state.tweens = this.tweens;

        this.state.children = this.children;
        this.state.color = this.color;
        this.state.data = this.data;
    },

    step: function (time, delta)
    {
        this.time.begin(time);

        this.tweens.begin(time);

        var list = this.children.list;

        for (var i = 0; i < list.length; i++)
        {
            list[i].preUpdate(time, delta);
        }

        //  preUpdate TimerEvents
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
            StableSort.inplace(this.children.list, this.sortZ);

            this.sortChildrenFlag = false;
        }

        this.cameras.render(renderer, this.children, interpolation);
    },

    sortZ: function (childA, childB)
    {
        return childA._z - childB._z;
    }
};

module.exports = Systems;
