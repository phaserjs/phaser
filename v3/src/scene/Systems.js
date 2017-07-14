
var CameraManager = require('../plugins/CameraManager');
var Class = require('../utils/Class');
var Clock = require('../time/Clock');
var Data = require('../plugins/Data');
var DisplayList = require('../plugins/DisplayList');
var EventDispatcher = require('../events/EventDispatcher');
var GameObjectCreator = require('../plugins/GameObjectCreator');
var GameObjectFactory = require('../plugins/GameObjectFactory');
var InputManager = require('../plugins/InputManager');
var Loader = require('../plugins/Loader');
var PoolManager = require('../plugins/PoolManager');
var Settings = require('./Settings');
var StableSort = require('../utils/array/StableSort');
var SceneManager = require('../plugins/SceneManager');
var TweenManager = require('../tween/TweenManager');
var UpdateList = require('../plugins/UpdateList');

var Systems = new Class({

    initialize:

    function Systems (scene, config)
    {
        this.scene = scene;

        this.config = config;
        this.settings = Settings.create(config);

        this.sortChildrenFlag = false;

        //  Set by the GlobalSceneManager
        this.mask = null;
        this.canvas;
        this.context;

        //  CORE (GLOBAL) SYSTEMS / PROPERTIES

        this.game;

        this.anims;
        this.cache;
        this.registry;
        this.textures;

        //  Reference to Scene specific managers (Factory, Tweens, Loader, Physics, etc)
        this.add;
        this.cameras;
        this.events;
        this.inputManager;
        this.load;
        this.make;
        this.pool;
        this.sceneManager;
        this.time;
        this.tweens;

        //  Scene properties
        this.updateList;
        this.displayList;
        this.data;
    },

    init: function (game)
    {
        var scene = this.scene;

        this.game = game;

        //  Game (Global) level managers

        this.anims = game.anims;
        this.cache = game.cache;
        this.registry = game.registry;
        this.textures = game.textures;

        //  Scene specific properties (transform, data, children, etc)

        this.inputManager = new InputManager(scene, game);
        this.updateList = new UpdateList(scene);
        this.displayList = new DisplayList(scene);
        this.data = new Data(scene);

        //  Scene specific managers (Factory, Tweens, Loader, Physics, etc)

        this.add = new GameObjectFactory(scene);
        this.cameras = new CameraManager(scene);
        this.events = new EventDispatcher();
        this.load = new Loader(scene);
        this.make = new GameObjectCreator(scene);
        this.pool = new PoolManager(scene);
        this.sceneManager = new SceneManager(scene, game);
        this.time = new Clock(scene);
        this.tweens = new TweenManager(scene);

        //  Sometimes the managers need access to a system created after them
        this.inputManager.boot();

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

        this.pool.begin(time);
        this.updateList.begin(time);
        this.time.begin(time);
        this.tweens.begin(time);
        this.inputManager.begin(time);

        this.pool.update(time, delta);
        this.updateList.update(time, delta);
        this.time.update(time, delta);
        this.tweens.update(time, delta);
        this.cameras.update(time, delta);
        this.inputManager.update(time, delta);

        this.scene.update.call(this.scene, time, delta);
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

    //  Force a sort of the display list next render
    depthSort: function ()
    {
        this.sortChildrenFlag = true;
    },

    sortZ: function (childA, childB)
    {
        return childA._z - childB._z;
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

        this.pool.shutdown();
        this.displayList.shutdown();
        this.updateList.shutdown();
        this.time.shutdown();
        this.tweens.shutdown();

        if (this.scene.shutdown)
        {
            this.scene.shutdown.call(this.scene);
        }
    },

    //  Game level nuke
    destroy: function ()
    {
        //  TODO

        this.pool.destroy();
        this.time.destroy();
        this.tweens.destroy();

        //  etc
        if (this.scene.destroy)
        {
            this.scene.destroy.call(this.scene);
        }
    }

});

module.exports = Systems;
