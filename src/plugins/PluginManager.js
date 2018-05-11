/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var EventEmitter = require('eventemitter3');
var IsPlainObject = require('../utils/object/IsPlainObject');
var GetFastValue = require('../utils/object/GetFastValue');

//  Contains the plugins that Phaser uses globally and locally.
//  These are the source objects, not instantiated.
var corePlugins = {};

//  Contains the plugins that the dev has loaded into their game
var gamePlugins = {};

/**
 * @classdesc
 * The PluginManager is global and belongs to the Game instance, not a Scene.
 * It handles the installation and removal of all global and Scene based plugins.
 * Plugins automatically register themselves with the PluginManager in their respective classes.
 *
 * @class PluginManager
 * @memberOf Phaser.Plugins
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - [description]
 */
var PluginManager = new Class({

    Extends: EventEmitter,

    initialize:

    function PluginManager (game)
    {
        EventEmitter.call(this);

        /**
         * [description]
         *
         * @name Phaser.Plugins.PluginManager#game
         * @type {Phaser.Game}
         * @since 3.0.0
         */
        this.game = game;

        //  Plugins currently running and managed by this Plugin Manager.
        //  These are Game instance specific.
        this.plugins = [];

        //  {
        //      key: '' <- the key set by the game, not the plugin author
        //      plugin: instance <- an instance of the plugin
        //      active: bool <- considered 'active' or not?
        //  }

        //  A list of plugin keys that should be installed into Scenes
        this.scenePlugins = [];

        this._pending = [];

        if (game.isBooted)
        {
            this.boot();
        }
        else
        {
            game.events.once('boot', this.boot, this);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Plugins.PluginManager#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        this.game.events.once('destroy', this.destroy, this);

        //  Any plugins to install?
        var list = this.game.config.installPlugins;

        //  Any plugins added outside of the game config, but before the game booted?
        list = list.concat(this._pending);

        for (var i = 0; i < list.length; i++)
        {
            var entry = list[i];

            // { key: 'TestPlugin', plugin: TestPlugin, start: true, isScenePlugin: false }

            var key = GetFastValue(entry, 'key', null);
            var plugin = GetFastValue(entry, 'plugin', null);
            var start = GetFastValue(entry, 'start', false);
            var isScenePlugin = GetFastValue(entry, 'isScenePlugin', false);

            if (key && plugin)
            {
                this.install(key, plugin, start, isScenePlugin);
            }
        }

        this._pending = [];
    },

    /**
     * [description]
     *
     * @method Phaser.Plugins.PluginManager#installGlobal
     * @since 3.0.0
     *
     * @param {Phaser.Scenes.Systems} sys - [description]
     * @param {array} globalPlugins - [description]
     */
    installGlobal: function (sys, globalPlugins)
    {
        var game = this.game;
        var scene = sys.scene;
        var map = sys.settings.map;

        //  Reference the GlobalPlugins from Game into Scene.Systems
        for (var i = 0; i < globalPlugins.length; i++)
        {
            var pluginKey = globalPlugins[i];

            // console.log('PluginManager.global', pluginKey);
            
            if (game[pluginKey])
            {
                sys[pluginKey] = game[pluginKey];

                //  Scene level injection
                if (map.hasOwnProperty(pluginKey))
                {
                    scene[map[pluginKey]] = sys[pluginKey];
                }
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Plugins.PluginManager#installLocal
     * @since 3.0.0
     *
     * @param {Phaser.Scenes.Systems} sys - [description]
     * @param {array} scenePlugins - [description]
     */
    installLocal: function (sys, scenePlugins)
    {
        var scene = sys.scene;
        var map = sys.settings.map;
        var isBooted = sys.settings.isBooted;

        for (var i = 0; i < scenePlugins.length; i++)
        {
            var pluginKey = scenePlugins[i];

            if (!corePlugins[pluginKey])
            {
                continue;
            }

            var source = corePlugins[pluginKey];

            var plugin = new source.plugin(scene);
            
            sys[source.mapping] = plugin;

            //  Scene level injection
            if (map.hasOwnProperty(source.mapping))
            {
                scene[map[source.mapping]] = plugin;
            }

            //  Scene is already booted, usually because this method is being called at run-time, so boot the plugin
            if (isBooted)
            {
                plugin.boot();
            }
        }
    },

    /**
     * Installs a plugin into the PluginManager.
     * 
     * Key is a reference used to get the plugin from the plugins object (i.e. MyPlugin)
     * Plugin is the function to instantiate to create a plugin instance.
     *
     * @method Phaser.Plugins.PluginManager#install
     * @since 3.8.0
     * 
     * @param {string} key - [description]
     * @param {function} plugin - [description]
     */
    install: function (key, plugin, start, isScenePlugin)
    {
        if (start === undefined) { start = false; }
        if (isScenePlugin === undefined) { isScenePlugin = false; }

        if (typeof plugin !== 'function')
        {
            console.warn('Invalid Plugin: ' + key);
            return;
        }

        if (gamePlugins.hasOwnProperty(key))
        {
            console.warn('Plugin key in use: ' + key);
            return;
        }

        if (!this.game.isBooted)
        {
            this._pending.push({ key: key, plugin: plugin, start: start, isScenePlugin: isScenePlugin });
        }
        else
        {
            //  Add it to the plugin store
            gamePlugins[key] = plugin;

            // if (isScenePlugin)
            // {
            //     this.scenePlugins.push(key);
            // }

            if (start)
            {
                return this.start(key);
            }
        }
    },

    getIndex: function (key)
    {
        var list = this.plugins;

        for (var i = 0; i < list.length; i++)
        {
            var entry = list[i];

            if (entry.key === key)
            {
                return i;
            }
        }

        return -1;
    },

    getEntry: function (key)
    {
        var idx = this.getIndex(key);

        if (idx !== -1)
        {
            return this.plugins[idx];
        }
    },

    isActive: function (key)
    {
        var entry = this.getEntry(key);

        return (entry && entry.active);
    },

    start: function (key, runAs)
    {
        if (runAs === undefined) { runAs = key; }

        var entry = this.getEntry(runAs);

        //  Plugin already running under this key?
        if (entry && !entry.active)
        {
            //  It exists, we just need to start it up again
            entry.active = true;
            entry.plugin.start();
        }
        else if (!entry)
        {
            var plugin = this.getClass(key);

            if (plugin)
            {
                var instance = new plugin(this);

                entry = {
                    key: runAs,
                    plugin: instance,
                    active: true
                };

                this.plugins.push(entry);

                instance.init();
                instance.start();
            }
        }

        return (entry) ? entry.plugin : null;
    },

    stop: function (key)
    {
        var entry = this.getEntry(key);

        if (entry && entry.active)
        {
            entry.active = false;
            entry.plugin.stop();
        }

        return this;
    },

    get: function (key)
    {
        var entry = this.getEntry(key);

        if (entry)
        {
            return entry.plugin;
        }
    },

    setScenePlugin: function (scene)
    {
    },

    addGameObject: function ()
    {

    },

    addFileType: function ()
    {

    },

    /**
     * [description]
     *
     * @method Phaser.Plugins.PluginManager#getClass
     * @since 3.8.0
     *
     * @param {string} key - [description]
     *
     * @return {Phaser.Plugins.Plugin} A Plugin object
     */
    getClass: function (key)
    {
        return (gamePlugins.hasOwnProperty(key)) ? gamePlugins[key] : null;
    },

    /**
     * [description]
     *
     * @method Phaser.Plugins.PluginManager#remove
     * @since 3.0.0
     *
     * @param {string} key - [description]
     */
    remove: function (key)
    {
        delete gamePlugins[key];
    },

    /**
     * [description]
     *
     * @method Phaser.Plugins.PluginManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.game = null;
    }

});

/*
 * "Sometimes, the elegant implementation is just a function.
 * Not a method. Not a class. Not a framework. Just a function."
 *  -- John Carmack
 */

/**
 * Static method called directly by the Core internal Plugins.
 * Key is a reference used to get the plugin from the plugins object (i.e. InputPlugin)
 * Plugin is the object to instantiate to create the plugin
 * Mapping is what the plugin is injected into the Scene.Systems as (i.e. input)
 *
 * @method Phaser.Plugins.PluginManager.register
 * @since 3.0.0
 * 
 * @param {string} key - [description]
 * @param {object} plugin - [description]
 * @param {string} mapping - [description]
 */
PluginManager.register = function (key, plugin, mapping)
{
    corePlugins[key] = { plugin: plugin, mapping: mapping };
};

module.exports = PluginManager;
