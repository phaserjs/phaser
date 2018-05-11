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
var plugins = {};

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
        this.activePlugins = [];

        //  Plugins that should be installed into Scenes
        this.scenePlugins = [];

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

        if (list)
        {
            for (var key in list)
            {
                // this.register(key, list[key]);
            }
        }
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
     * Registers a plugin with the PluginManager.
     * 
     * Key is a reference used to get the plugin from the plugins object (i.e. MyPlugin)
     * Plugin is the function to instantiate to create a plugin instance.
     *
     * @method Phaser.Plugins.PluginManager#register
     * @since 3.8.0
     * 
     * @param {string} key - [description]
     * @param {function} plugin - [description]
     */
    register: function (key, plugin, start, isScenePlugin)
    {
        if (start === undefined) { start = false; }
        if (isScenePlugin === undefined) { isScenePlugin = false; }

        if (typeof plugin !== 'function')
        {
            console.warn('Invalid Plugin: ' + key);
            return;
        }

        if (plugins.hasOwnProperty(key))
        {
            console.warn('Plugin key in use: ' + key);
            return;
        }

        //  Add it to the plugin store
        plugins[key] = plugin;

        if (start)
        {
            this.start(key);
        }

        if (isScenePlugin)
        {

        }

        return this;
    },

    start: function (key)
    {
        var instance;
        var plugin = this.get(key);

        if (plugin)
        {
            instance = new plugin(this);

            this.activePlugins.push(instance);
        }

        return instance;
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
     * @method Phaser.Plugins.PluginManager#get
     * @since 3.8.0
     *
     * @param {string} key - [description]
     *
     * @return {Phaser.Plugins.Plugin} A Plugin object
     */
    get: function (key)
    {
        return (plugins.hasOwnProperty(key)) ? plugins[key] : null;
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
        delete plugins[key];
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
