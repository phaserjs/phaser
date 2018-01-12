var CameraManager = require('../../camera/local/CameraManager');
var Class = require('../../utils/Class');
var Clock = require('../../time/Clock');
var Data = require('../../data/Data');
var DataStore = require('../../data/DataStore');
var DisplayList = require('../plugins/DisplayList');
var EventEmitter = require('eventemitter3');
var GameObjectCreator = require('../plugins/GameObjectCreator');
var GameObjectFactory = require('../plugins/GameObjectFactory');
var InputManager = require('../plugins/InputManager');
var Loader = require('../plugins/Loader');
var PhysicsManager = require('../plugins/PhysicsManager');
var SceneManager = require('../plugins/SceneManager');
var Settings = require('./Settings');
var TweenManager = require('../../tweens/manager/TweenManager');
var UpdateList = require('../plugins/UpdateList');

// var PluginManager = require('../../plugins/PluginManager');

var Systems = new Class({

    initialize:

    function Systems (scene, config)
    {
        this.scene = scene;

        this.game;

        this.config = config;

        this.settings = Settings.create(config);

        //  Set by the GlobalSceneManager - a reference to the game canvas / context

        this.canvas;
        this.context;

        //  Global Systems - these are global managers (belonging to Game)

        this.anims;
        this.cache;
        this.registry;
        this.sound;
        this.textures;

        //  These are core Scene plugins, needed by lots of the global systems (and each other)

        this.cameras;
        this.displayList;
        this.events;
        this.sceneManager;
        this.time;
        this.updateList;

        //  Optional Scene plugins - not referenced by core systems, can be overridden with user code

        // this.plugins;

        this.add;
        this.data;
        this.dataStore;
        this.inputManager;
        this.load;
        this.make;
        this.physicsManager;
        this.tweens;
    },

    init: function (game)
    {
        var scene = this.scene;

        this.game = game;

        //  Global Systems - these are global managers (belonging to Game)

        this.anims = game.anims;
        this.cache = game.cache;
        this.registry = game.registry;
        this.sound = game.sound;
        this.textures = game.textures;

        //  These are core Scene plugins, needed by lots of the global systems (and each other)

        this.cameras = new CameraManager(scene);
        this.displayList = new DisplayList(scene);
        this.events = new EventEmitter();
        this.sceneManager = new SceneManager(scene);
        this.time = new Clock(scene);
        this.updateList = new UpdateList(scene);

        //  Optional Scene plugins - not referenced by core systems, can be overridden with user code

        this.add = new GameObjectFactory(scene);
        this.data = new Data(scene);
        this.dataStore = new DataStore(scene);
        this.inputManager = new InputManager(scene);
        this.load = new Loader(scene);
        this.make = new GameObjectCreator(scene);
        this.physicsManager = new PhysicsManager(scene);
        this.tweens = new TweenManager(scene);

        // this.plugins = new PluginManager(scene);

        //  Sometimes the managers need access to a system created after them
        this.add.boot(this);
        this.make.boot(this);
        this.inputManager.boot();
        this.physicsManager.boot();

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

            this.scene[map[key]] = this[key];
        }
    },

    step: function (time, delta)
    {
        //  Are there any pending SceneManager actions?
        this.sceneManager.update();

        if (!this.settings.active)
        {
            return;
        }

        //  Move these into local arrays, so you can control which systems are registered here and their
        //  execution order

        this.updateList.begin(time);
        this.time.begin(time);
        this.tweens.begin(time);
        this.inputManager.begin(time);

        this.physicsManager.update(time, delta);

        this.updateList.update(time, delta);
        this.time.update(time, delta);
        this.tweens.update(time, delta);
        this.cameras.update(time, delta);
        this.inputManager.update(time, delta);

        this.scene.update.call(this.scene, time, delta);

        this.physicsManager.postUpdate();
    },

    render: function (interpolation, renderer)
    {
        if (!this.settings.visible)
        {
            return;
        }

        var displayList = this.displayList;

        displayList.process();

        this.cameras.render(renderer, displayList, interpolation);
    },

    //  Force a sort of the display list on the next render
    queueDepthSort: function ()
    {
        this.displayList.queueDepthSort();
    },

    //  Immediately sorts the display list if the flag is set
    depthSort: function ()
    {
        this.displayList.depthSort();
    },

    //  A paused Scene still renders, it just doesn't run ANY of its update handlers or systems
    pause: function ()
    {
        //  Was paused by the GlobalSceneManager

        this.settings.active = false;

        if (this.scene.pause)
        {
            this.scene.pause.call(this.scene);
        }
    },

    resume: function ()
    {
        //  Was resumed by the GlobalSceneManager

        this.settings.active = true;

        if (this.scene.resume)
        {
            this.scene.resume.call(this.scene);
        }
    },

    sleep: function ()
    {
        //  Was sent to sleep by the GlobalSceneManager

        this.settings.active = false;
        this.settings.visible = false;

        if (this.scene.sleep)
        {
            this.scene.sleep.call(this.scene);
        }
    },

    wake: function ()
    {
        //  Was woken up by the GlobalSceneManager

        this.settings.active = true;
        this.settings.visible = true;

        if (this.scene.wake)
        {
            this.scene.wake.call(this.scene);
        }
    },

    start: function (data)
    {
        //  Was started by the GlobalSceneManager

        this.settings.data = data;

        this.settings.active = true;
        this.settings.visible = true;
    },

    shutdown: function ()
    {
        //  Was stopped by the GlobalSceneManager

        this.settings.active = false;
        this.settings.visible = false;

        this.displayList.shutdown();
        this.updateList.shutdown();
        this.time.shutdown();
        this.tweens.shutdown();
        this.physicsManager.shutdown();

        if (this.scene.shutdown)
        {
            this.scene.shutdown.call(this.scene);
        }
    },

    //  TODO: Game level nuke
    destroy: function ()
    {
        this.add.destroy();
        this.time.destroy();
        this.tweens.destroy();
        this.physicsManager.destroy();

        //  etc
        if (this.scene.destroy)
        {
            this.scene.destroy.call(this.scene);
        }
    }

});

module.exports = Systems;
