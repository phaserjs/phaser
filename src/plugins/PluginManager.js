/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var EventEmitter = require('eventemitter3');
var FileTypesManager = require('../loader/FileTypesManager');
var GameObjectCreator = require('../gameobjects/GameObjectCreator');
var GameObjectFactory = require('../gameobjects/GameObjectFactory');
var GetFastValue = require('../utils/object/GetFastValue');
var PluginCache = require('./PluginCache');

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
        //  {
        //      key: '' <- the key set by the game, not the plugin author
        //      plugin: instance <- an instance of the plugin
        //      active: bool <- considered 'active' or not?
        //  }
        this.plugins = [];

        //  A list of plugin keys that should be installed into Scenes as well as the Core Plugins
        this.scenePlugins = [];

        this._pendingGlobal = [];
        this._pendingScene = [];

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
        var i;
        var entry;
        var key;
        var plugin;
        var start;
        var mapping;
        var config = this.game.config;

        //  Any plugins to install?
        var list = config.installGlobalPlugins;

        //  Any plugins added outside of the game config, but before the game booted?
        list = list.concat(this._pendingGlobal);

        for (i = 0; i < list.length; i++)
        {
            entry = list[i];

            // { key: 'TestPlugin', plugin: TestPlugin, start: true }

            key = GetFastValue(entry, 'key', null);
            plugin = GetFastValue(entry, 'plugin', null);
            start = GetFastValue(entry, 'start', false);

            if (key && plugin)
            {
                this.install(key, plugin, start);
            }
        }

        //  Any scene plugins to install?
        list = config.installScenePlugins;

        //  Any plugins added outside of the game config, but before the game booted?
        list = list.concat(this._pendingScene);

        for (i = 0; i < list.length; i++)
        {
            entry = list[i];

            // { key: 'moveSpritePlugin', plugin: MoveSpritePlugin, , mapping: 'move' }

            key = GetFastValue(entry, 'key', null);
            plugin = GetFastValue(entry, 'plugin', null);
            mapping = GetFastValue(entry, 'mapping', null);

            if (key && plugin)
            {
                this.installScenePlugin(key, plugin, mapping);
            }
        }

        this._pendingGlobal = [];
        this._pendingScene = [];

        this.game.events.once('destroy', this.destroy, this);
    },

    /**
     * [description]
     *
     * @method Phaser.Plugins.PluginManager#addToScene
     * @since 3.8.0
     *
     * @param {Phaser.Scenes.Systems} sys - [description]
     * @param {array} globalPlugins - [description]
     * @param {array} scenePlugins - [description]
     */
    addToScene: function (sys, globalPlugins, scenePlugins)
    {
        this.addGlobalToScene(sys, globalPlugins);

        for (var i = 0; i < scenePlugins.length; i++)
        {
            this.addLocalToScene(sys, scenePlugins[i]);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Plugins.PluginManager#addGlobalToScene
     * @since 3.0.0
     *
     * @param {Phaser.Scenes.Systems} sys - [description]
     * @param {array} globalPlugins - [description]
     */
    addGlobalToScene: function (sys, globalPlugins)
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
     * @method Phaser.Plugins.PluginManager#addLocalToScene
     * @since 3.8.0
     *
     * @param {Phaser.Scenes.Systems} sys - [description]
     * @param {array} scenePlugins - [description]
     */
    addLocalToScene: function (sys, scenePlugins)
    {
        var scene = sys.scene;
        var map = sys.settings.map;
        var isBooted = sys.settings.isBooted;

        for (var i = 0; i < scenePlugins.length; i++)
        {
            var pluginKey = scenePlugins[i];

            if (!PluginCache.hasCore(pluginKey))
            {
                continue;
            }

            var source = PluginCache.getCore(pluginKey);

            var plugin = new source.plugin(scene, this);
            
            sys[source.mapping] = plugin;

            //  Scene level injection
            if (source.custom)
            {
                scene[source.mapping] = plugin;
            }
            else if (map.hasOwnProperty(source.mapping))
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

    //  Called by Scene.Systems to get the default list of plugins to install
    getDefaultScenePlugins: function ()
    {
        var list = this.game.config.defaultPlugins;

        //  Merge in custom Scene plugins
        list = list.concat(this.scenePlugins);

        return list;
    },

    //  private to the PM
    //  key = Scene.Systems property key
    //  plugin = code
    //  mapping = Scene key
    installScenePlugin: function (key, plugin, mapping, addToScene)
    {
        if (typeof plugin !== 'function')
        {
            console.warn('Invalid Scene Plugin: ' + key);
            return;
        }

        if (PluginCache.hasCore(key))
        {
            console.warn('Scene Plugin key in use: ' + key);
            return;
        }

        PluginCache.register(key, plugin, mapping, true);

        this.scenePlugins.push(key);

        if (addToScene)
        {
            var instance = new plugin(addToScene, this);

            addToScene.sys[key] = instance;

            if (mapping && mapping !== '')
            {
                addToScene[mapping] = instance;
            }

            instance.boot();
        }
    },

    /**
     * Installs a global plugin into the PluginManager.
     * Global plugins belong to the game and cannot be installed into a Scene.
     * For Scene level plugins, see `installScenePlugin`.
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
    install: function (key, plugin, start)
    {
        if (start === undefined) { start = false; }

        if (typeof plugin !== 'function')
        {
            console.warn('Invalid Plugin: ' + key);
            return;
        }

        if (PluginCache.hasCustom(key))
        {
            console.warn('Plugin key in use: ' + key);
            return;
        }

        if (!this.game.isBooted)
        {
            this._pendingGlobal.push({ key: key, plugin: plugin, start: start });
        }
        else
        {
            //  Add it to the plugin store
            PluginCache.registerCustom(key, plugin);
            // gamePlugins[key] = plugin;

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
        // return (gamePlugins.hasOwnProperty(key)) ? gamePlugins[key] : null;
        return PluginCache.getCustomClass(key);
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
        // delete gamePlugins[key];
        PluginCache.removeCustom(key);
    },

    //  When registering a factory function 'this' refers to the GameObjectFactory context.
    //
    //  There are several properties available to use:
    //
    //  this.scene - a reference to the Scene that owns the GameObjectFactory
    //  this.displayList - a reference to the Display List the Scene owns
    //  this.updateList - a reference to the Update List the Scene owns

    registerGameObject: function (key, factoryCallback, creatorCallback)
    {
        if (factoryCallback)
        {
            GameObjectFactory.register(key, factoryCallback);
        }

        if (creatorCallback)
        {
            GameObjectCreator.register(key, creatorCallback);
        }

        return this;
    },

    registerFileType: function (key, callback)
    {
        FileTypesManager.register(key, callback);
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

module.exports = PluginManager;
