var Class = require('../utils/Class');
var EventEmitter = require('eventemitter3');
var GetFastValue = require('../utils/object/GetFastValue');
var ScenePlugin = require('./ScenePlugin');
var Settings = require('./Settings');

var Systems = new Class({

    initialize:

    function Systems (scene, config)
    {
        this.scene = scene;

        this.game;

        this.config = config;

        this.settings = Settings.create(config);

        //  Set by the SceneManager - a reference to the Scene canvas / context

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

        game.plugins.install(scene,
            [ 'anims', 'cache', 'registry', 'sound', 'textures' ],
            [ 'displayList', 'updateList', 'sceneManager', 'time', 'cameras', 'add', 'make', 'load', 'tweens', 'input' ]
        );

        var physics = this.getPhysicsSystem();

        if (physics)
        {
            game.plugins.install(scene, [], physics);
        }

        this.events.emit('boot', this);
    },

    getPhysicsSystem: function ()
    {
        var defaultSystem = this.game.config.defaultPhysicsSystem;
        var sceneSystems = GetFastValue(this.settings, 'physics', false);

        if (!defaultSystem && !sceneSystems)
        {
            //  No default physics system or systems in this scene
            return;
        }

        //  Let's build the systems array
        var output = [];

        if (defaultSystem)
        {
            output.push(defaultSystem + 'Physics');
        }

        if (sceneSystems)
        {
            for (var key in sceneSystems)
            {
                key = key.concat('Physics');

                if (output.indexOf(key) === -1)
                {
                    output.push(key);
                }
            }
        }

        //  An array of Physics systems to start for this Scene
        return output;
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
        this.events.emit('preupdate', time, delta);

        if (!this.settings.active)
        {
            return;
        }

        this.events.emit('update', time, delta);

        this.scene.update.call(this.scene, time, delta);

        this.events.emit('postupdate', time, delta);
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
        //  Was paused by the SceneManager

        this.settings.active = false;

        this.events.emit('pause', this);
    },

    resume: function ()
    {
        //  Was resumed by the SceneManager

        this.settings.active = true;

        this.events.emit('resume', this);
    },

    sleep: function ()
    {
        //  Was sent to sleep by the SceneManager

        this.settings.active = false;
        this.settings.visible = false;

        this.events.emit('sleep', this);
    },

    wake: function ()
    {
        //  Was woken up by the SceneManager

        this.settings.active = true;
        this.settings.visible = true;

        this.events.emit('wake', this);
    },

    start: function (data)
    {
        //  Was started by the SceneManager

        this.settings.data = data;

        this.settings.active = true;
        this.settings.visible = true;

        this.events.emit('start', this);
    },

    shutdown: function ()
    {
        //  Was stopped by the SceneManager

        this.settings.active = false;
        this.settings.visible = false;

        this.events.emit('shutdown', this);
    },

    destroy: function ()
    {
        this.events.emit('destroy', this);
    }

});

module.exports = Systems;
