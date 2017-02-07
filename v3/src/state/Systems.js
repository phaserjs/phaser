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
// var Camera = require('../camera/Camera');
var Settings = require('./Settings');
var RTree = require('../structs/RTree');
var Camera = require('../camera/Camera-2')

var Systems = function (state, config)
{
    this.state = state;

    this.game = null;

    this.config = config;

    this.settings;

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

        this.settings = Settings(this.config, this.game.config);

        this.cache = this.game.cache;
        this.textures = this.game.textures;

        //  State specific managers (Factory, Tweens, Loader, Physics, etc)

        this.tree = RTree(16);
        this.events = new EventDispatcher();
        this.add = new GameObjectFactory(this.state);
        this.make = GameObjectCreator(this.state);
        this.updates = new UpdateManager(this.state);
        this.load = new Loader(this.state);

        //  State specific properties (transform, data, children, etc)

        // this.camera = new Camera(this.state, 0, 0, this.settings.width, this.settings.height);
        this.children = new Component.Children(this.state);
        this.color = new Component.Color(this.state);
        this.data = new Component.Data(this.state);
        this.transform = new Component.Transform(this.state);
        this.camera = new Camera(0, 0, this.game.config.width, this.game.config.height);
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

        // this.state.camera = this.camera;
        this.state.transform = this.transform;

        this.state.state = this.game.state;
        this.state.cache = this.game.cache;
        this.state.textures = this.game.textures;

        this.camera.setState(this.state);
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

            // if (child.exists)
            // {
                child.update(timestep);
            // }
        }

        this.state.update(timestep, physicsStep);
    },

    render: function (interpolation, renderer)
    {
        var transform = this.transform;
        this.camera.preRender();
        renderer.render(this.state, transform.flatRenderArray, interpolation);
        this.state.render(interpolation);
        this.camera.postRender();
    },

    //  Called just once per frame, regardless of speed

    /*
    OLDrender: function (interpolation, renderer)
    {
        this.updates.start();

        if (this.settings.visible && this.color.alpha !== 0)
        {
            var list = this.tree.search({
                minX: this.camera.x,
                minY: this.camera.y,
                maxX: this.camera.right,
                maxY: this.camera.bottom
            });

            renderer.render(this.state, list, interpolation);
        }

        this.updates.stop();

        this.state.render(interpolation);
    }
    */
};

module.exports = Systems;
