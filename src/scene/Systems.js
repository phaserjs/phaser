var Class = require('../utils/Class');
var Settings = require('./Settings');
var EventEmitter = require('eventemitter3');

// var Data = require('../../data/Data');
// var DataStore = require('../../data/DataStore');
// var InputManager = require('../../input/InputPlugin');
// var PhysicsManager = require('../plugins/PhysicsManager');

var Systems = new Class({

    initialize:

    function Systems (scene, config)
    {
        this.scene = scene;

        this.game;

        this.config = config;

        this.settings = Settings.create(config);

        //  Set by the GlobalSceneManager - a reference to the Scene canvas / context

        this.canvas;
        this.context;

        //  Global Systems - these are global managers (belonging to Game)

        this.anims;
        this.cache;
        this.registry;
        this.sound;
        this.textures;

        //  These are core Scene plugins, needed by lots of the global systems (and each other)

        this.add;
        this.cameras;
        this.displayList;
        this.events;
        this.make;
        this.sceneManager;
        this.time;
        this.updateList;
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

        this.events = new EventEmitter();

        game.plugins.install(scene, [ 'displayList', 'updateList', 'sceneManager', 'time', 'cameras', 'add', 'make', 'load', 'tweens' ]);

        //  Optional Scene plugins - not referenced by core systems, can be overridden with user code

        // game.plugins.install(scene, [ , 'test' ]);

        // this.data = new Data(scene);
        // this.dataStore = new DataStore(scene);
        // this.inputManager = new InputManager(scene);
        // this.physicsManager = new PhysicsManager(scene);
        // this.tweens = new TweenManager(scene);

        //  Sometimes the managers need access to a system created after them

        this.events.emit('boot', this);
    },

    inject: function (plugin)
    {
        var map = this.settings.map;

        if (plugin.mapping && map.hasOwnProperty(plugin.mapping))
        {
            this.scene[plugin.mapping] = plugin;
        }
    },

    step: function (time, delta)
    {
        //  Are there any pending SceneManager actions?
        //  This plugin is a special case, as it can literally modify this Scene, so we update it directly.
        this.sceneManager.update();

        if (!this.settings.active)
        {
            return;
        }

        this.events.emit('preupdate', time, delta);

        // this.tweens.begin(time);
        // this.inputManager.begin(time);

        this.events.emit('update', time, delta);

        // this.physicsManager.update(time, delta);

        // this.tweens.update(time, delta);
        // this.inputManager.update(time, delta);

        this.scene.update.call(this.scene, time, delta);

        this.events.emit('postupdate', time, delta);

        // this.physicsManager.postUpdate();
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

        this.events.emit('shutdown', this);

        // this.displayList.shutdown();
        // this.updateList.shutdown();
        // this.time.shutdown();
        // this.tweens.shutdown();
        // this.physicsManager.shutdown();

        if (this.scene.shutdown)
        {
            this.scene.shutdown.call(this.scene);
        }
    },

    //  TODO: Game level nuke
    destroy: function ()
    {
        this.events.emit('destroy', this);

        // this.add.destroy();
        // this.time.destroy();
        // this.tweens.destroy();
        // this.physicsManager.destroy();

        //  etc
        if (this.scene.destroy)
        {
            this.scene.destroy.call(this.scene);
        }
    }

});

module.exports = Systems;
