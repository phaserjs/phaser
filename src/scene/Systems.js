var Class = require('../utils/Class');
var CONST = require('./const');
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

        //  A handy reference to the Scene canvas / context
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
        this.settings.status = CONST.INIT;

        this.game = game;

        this.canvas = game.canvas;
        this.context = game.context;

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

        this.events.emit('update', time, delta);

        this.scene.update.call(this.scene, time, delta);

        this.events.emit('postupdate', time, delta);
    },

    render: function (renderer)
    {
        var displayList = this.displayList;

        displayList.process();

        this.cameras.render(renderer, displayList);

        this.events.emit('render', renderer);
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
        if (this.settings.active)
        {
            this.settings.status = CONST.PAUSED;

            this.settings.active = false;

            this.events.emit('pause', this);
        }
    },

    resume: function ()
    {
        if (!this.settings.active)
        {
            this.settings.status = CONST.RUNNING;

            this.settings.active = true;

            this.events.emit('resume', this);
        }
    },

    sleep: function ()
    {
        this.settings.status = CONST.SLEEPING;

        this.settings.active = false;
        this.settings.visible = false;

        this.events.emit('sleep', this);
    },

    wake: function ()
    {
        this.settings.status = CONST.RUNNING;

        this.settings.active = true;
        this.settings.visible = true;

        this.events.emit('wake', this);
    },

    isSleeping: function ()
    {
        return (this.settings.status === CONST.SLEEPING);
    },

    isActive: function ()
    {
        return (this.settings.status === CONST.RUNNING);
    },

    isVisible: function ()
    {
        return this.settings.visible;
    },

    setVisible: function (value)
    {
        this.settings.visible = value;

        return this;
    },

    setActive: function (value)
    {
        if (value)
        {
            return this.resume();
        }
        else
        {
            return this.pause();
        }
    },

    start: function (data)
    {
        this.settings.status = CONST.START;

        this.settings.data = data;

        this.settings.active = true;
        this.settings.visible = true;

        this.events.emit('start', this);
    },

    shutdown: function ()
    {
        this.settings.status = CONST.SHUTDOWN;

        this.settings.active = false;
        this.settings.visible = false;

        this.events.emit('shutdown', this);
    },

    destroy: function ()
    {
        this.settings.status = CONST.DESTROYED;

        this.events.emit('destroy', this);
    }

});

module.exports = Systems;
