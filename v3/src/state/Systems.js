/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var EventDispatcher = require('../events/EventDispatcher');
var GameObjectFactory = require('./systems/GameObjectFactory');
var GameObjectCreator = require('./systems/GameObjectCreator');
var Loader = require('./systems/Loader');
var UpdateManager = require('./systems/UpdateManager');
var Component = require('../components');
var Camera = require('../camera/Camera');
var Settings = require('./Settings');

var Systems = function (state, config)
{
    this.state = state;

    this.game = null;

    this.config = config;

    this.settings = Settings(config);

    //  Reference to the global Game level systems
    this.textureManager;
    this.stateManager;

    //  CORE SYSTEMS / PROPERTIES

    //  Reference to State specific managers (Factory, Tweens, Loader, Physics, etc)
    this.add;
    this.make;
    this.load;
    this.events;
    this.updates;

    //  State properties
    this.camera;
    this.children;
    this.color;
    this.data;
    this.fbo;
    this.time;
    this.transform;
};

Systems.prototype.constructor = Systems;

Systems.prototype = {

    init: function (game)
    {
        console.log('State.Systems.init');

        this.game = game;

        //  State specific managers (Factory, Tweens, Loader, Physics, etc)

        this.textures = game.textures;
        this.events = new EventDispatcher();
        this.add = new GameObjectFactory(this.state);
        this.make = GameObjectCreator(this.state);
        this.updates = new UpdateManager(this.state);
        this.load = new Loader(this.state);

        //  State specific properties (transform, data, children, etc)

        this.camera = new Camera(this.state, 0, 0, 800, 600);
        this.children = new Component.Children(this.state);
        this.color = new Component.Color(this.state);
        this.data = new Component.Data(this.state);
        this.transform = this.camera.transform;

        this.inject();
    },

    inject: function ()
    {
        //  Defaults properties injected into the State

        this.state.events = this.events;
        this.state.add = this.add;
        this.state.load = this.load;
        this.state.children = this.children;
        this.state.color = this.color;
        this.state.data = this.data;
        this.state.state = this.game.state; // StateManager

        this.state.camera = this.camera;
        this.state.transform = this.camera.transform;
        this.state.textures = this.textures;
    },

    //  Called just once per frame, regardless of speed
    begin: function (timestamp, frameDelta)
    {
    },

    //  Potentially called multiple times per frame (on super-fast systems)
    update: function (timestep, physicsStep)
    {
        for (var c = 0; c < this.children.list.length; c++)
        {
            var child = this.children.list[c];

            if (child.exists)
            {
                child.update(timestep);
            }
        }

        this.state.update(timestep, physicsStep);
    },

    //  Called just once per frame, regardless of speed
    render: function (interpolationPercentage, renderer)
    {
        this.updates.start();

        if (this.settings.visible && this.color.alpha !== 0)
        {
            renderer.render(this.state, interpolationPercentage);
        }

        this.updates.stop();

        this.state.render(interpolationPercentage);
    }
};

module.exports = Systems;
