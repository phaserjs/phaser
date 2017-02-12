/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var EventDispatcher = require('../events/EventDispatcher');
var GameObjectFactory = require('./systems/GameObjectFactory');
var GameObjectCreator = require('./systems/GameObjectCreator');
var StateManager = require('./systems/StateManager');
var Loader = require('./systems/Loader');
var UpdateManager = require('./systems/UpdateManager');
var Component = require('../components');
var Settings = require('./Settings');
var RTree = require('../structs/RTree');
var CameraManager = require('./systems/CameraManager');

var Systems = function (state, config)
{
    this.state = state;

    this.game = null;

    this.config = config;

    this.settings = Settings.create(config);

    this.x = this.settings.x;
    this.y = this.settings.y;
    this.width = this.settings.width;
    this.height = this.settings.height;

    this.mask = null;
    this.canvas;
    this.context;

    //  CORE SYSTEMS / PROPERTIES

    this.cache;
    this.textures;

    //  Reference to State specific managers (Factory, Tweens, Loader, Physics, etc)
    this.add;
    this.make;
    this.load;
    this.events;
    this.updates;
    this.tree;
    this.stateManager;

    //  State properties
    this.cameras;
    this.children;
    this.color;
    this.data;
    // this.fbo;
    this.time;
    this.transform;
};

Systems.prototype.constructor = Systems;

Systems.prototype = {

    init: function (game)
    {
        // console.log('State.Systems.init');

        this.game = game;

        Settings.init(this.settings, this.game.config);

        this.width = this.settings.width;
        this.height = this.settings.height;

        this.cache = this.game.cache;
        this.textures = this.game.textures;

        //  State specific managers (Factory, Tweens, Loader, Physics, etc)

        this.tree = RTree(16);
        this.events = new EventDispatcher();
        this.add = new GameObjectFactory(this.state);
        this.make = new GameObjectCreator(this.state);
        this.updates = new UpdateManager(this.state);
        this.load = new Loader(this.state);
        this.stateManager = new StateManager(this.state, game);
        this.cameras = new CameraManager(this.state);

        //  State specific properties (transform, data, children, etc)

        this.children = new Component.Children(this.state);
        this.color = new Component.Color(this.state);
        this.data = new Component.Data(this.state);
        this.transform = new Component.Transform(this.state);

        this.inject();
    },

    inject: function ()
    {
        //  Defaults properties injected into the State

        this.state.game = this.game;

        this.state.events = this.events;
        this.state.add = this.add;
        this.state.load = this.load;
        this.state.children = this.children;
        this.state.color = this.color;
        this.state.data = this.data;
        this.state.settings = this.settings;
        this.state.state = this.stateManager;

        this.state.cameras = this.cameras;
        this.state.transform = this.transform;

        this.state.cache = this.game.cache;
        this.state.textures = this.game.textures;
    },

    //  Called just once per frame, regardless of speed
    begin: function (timestamp, frameDelta)
    {
    },

    //  Potentially called multiple times per frame (on super-fast systems)
    update: function (timestep, physicsStep)
    {
        this.cameras.update(timestep);

        this.state.update.call(this.state, timestep, physicsStep);
    },

    render: function (interpolation, renderer)
    {
        if (!this.settings.visible)
        {
            return;
        }

        this.cameras.render(renderer, this.transform.flatRenderArray, interpolation);
    }
};

module.exports = Systems;
