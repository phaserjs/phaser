var Class = require('../utils/Class');
var CoreScenePlugins = require('../CoreScenePlugins');
var GetPhysicsPlugins = require('./GetPhysicsPlugins');
var GetScenePlugins = require('./GetScenePlugins');
var GlobalPlugins = require('../GlobalPlugins');
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

        //  Global Systems - these are single-instance global managers that belong to Game

        this.anims;
        this.cache;
        this.plugins;
        this.registry;
        this.sound;
        this.textures;

        //  Core Plugins - these are non-optional Scene plugins, needed by lots of the other systems

        this.add;
        this.cameras;
        this.displayList;
        this.events;
        this.make;
        this.scenePlugin;
        this.updateList;
    },

    init: function (game)
    {
        this.game = game;

        var pluginManager = game.plugins;

        this.plugins = pluginManager;

        pluginManager.installGlobal(this, GlobalPlugins);

        pluginManager.installLocal(this, CoreScenePlugins);

        pluginManager.installLocal(this, GetScenePlugins(this));

        pluginManager.installLocal(this, GetPhysicsPlugins(this));

        this.events.emit('boot', this);

        this.settings.isBooted = true;
    },

    install: function (plugin)
    {
        if (!Array.isArray(plugin))
        {
            plugin = [ plugin ];
        }

        this.plugins.installLocal(this, plugin);
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
