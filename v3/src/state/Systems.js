
var CameraManager = require('./systems/CameraManager');
var Component = require('../components');
var EventDispatcher = require('../events/EventDispatcher');
var GameObjectCreator = require('./systems/GameObjectCreator');
var GameObjectFactory = require('./systems/GameObjectFactory');
var Loader = require('./systems/Loader');
var Settings = require('./Settings');
var StableSort = require('../utils/array/StableSort');
var StateManager = require('./systems/StateManager');
var UpdateManager = require('./systems/UpdateManager');
var TweenManager = require('../tween/TweenManager');

var Systems = function (state, config)
{
    this.state = state;

    this.config = config;
    this.settings = Settings.create(config);

    this.x = this.settings.x;
    this.y = this.settings.y;
    this.width = this.settings.width;
    this.height = this.settings.height;

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
    this.textures;

    //  Reference to State specific managers (Factory, Tweens, Loader, Physics, etc)
    this.add;
    this.cameras;
    this.events;
    this.load;
    this.make;
    this.stateManager;
    this.updates;
    this.tweens;

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

        Settings.init(this.settings, this.game.config);

        this.width = this.settings.width;
        this.height = this.settings.height;

        this.anims = this.game.anims;
        this.cache = this.game.cache;
        this.input = this.game.input;
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
        this.state.textures = this.textures;

        this.state.add = this.add;
        this.state.make = this.make;
        this.state.cameras = this.cameras;
        this.state.events = this.events;
        this.state.load = this.load;
        this.state.settings = this.settings;
        this.state.state = this.stateManager;
        this.state.tweens = this.tweens;

        this.state.children = this.children;
        this.state.color = this.color;
        this.state.data = this.data;
    },

    step: function (time, delta)
    {
        this.tweens.begin(time);

        var list = this.children.list;

        for (var i = 0; i < list.length; i++)
        {
            list[i].preUpdate(time, delta);
        }

        this.tweens.update(time, delta);

        this.cameras.update(time, delta);

        this.state.update.call(this.state, time, delta);
    },

    //  Called just once per frame, regardless of speed

    /*
    begin: function (timestamp, frameDelta)
    {
        var list = this.children.list;

        for (var i = 0; i < list.length; i++)
        {
            list[i].preUpdate(timestamp, frameDelta);
        }
    },

    //  Potentially called multiple times per frame (on super-fast systems)
    update: function (timestep, physicsStep)
    {
        this.cameras.update(timestep);

        this.state.update.call(this.state, timestep, physicsStep);
    },
    */

    //  Called just once per frame
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
