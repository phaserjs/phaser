/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');

var plugins = {};

/**
 * @classdesc
 * The PluginManager is global and belongs to the Game instance, not a Scene.
 * It handles the installation and removal of all global and Scene based plugins.
 * Plugins automatically register themselves with the PluginManager in their respective classes.
 *
 * @class PluginManager
 * @memberOf Phaser.Boot
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - [description]
 */
var PluginManager = new Class({

    initialize:

    function PluginManager (game)
    {
        /**
         * [description]
         *
         * @name Phaser.Boot.PluginManager#game
         * @type {Phaser.Game}
         * @since 3.0.0
         */
        this.game = game;

        game.events.once('boot', this.boot, this);
    },

    /**
     * [description]
     *
     * @method Phaser.Boot.PluginManager#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        this.game.events.once('destroy', this.destroy, this);
    },

    /**
     * [description]
     *
     * @method Phaser.Boot.PluginManager#installGlobal
     * @since 3.0.0
     *
     * @param {Phaser.Scenes.Systems} sys - [description]
     * @param {array} globalPlugins - [description]
     */
    installGlobal: function (sys, globalPlugins)
    {
        var game = sys.game;
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
     * @method Phaser.Boot.PluginManager#installLocal
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

            if (!plugins[pluginKey])
            {
                continue;
            }

            var source = plugins[pluginKey];

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
     * [description]
     *
     * @method Phaser.Boot.PluginManager#remove
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
     * @method Phaser.Boot.PluginManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.game = null;
    }

});

/**
 * Static method called directly by the Plugins
 * Key is a reference used to get the plugin from the plugins object (i.e. InputPlugin)
 * Plugin is the object to instantiate to create the plugin
 * Mapping is what the plugin is injected into the Scene.Systems as (i.e. input)
 *
 * @method PluginManager.register
 * @since 3.0.0
 * 
 * @param {string} key - [description]
 * @param {object} plugin - [description]
 * @param {string} mapping - [description]
 */
PluginManager.register = function (key, plugin, mapping)
{
    plugins[key] = { plugin: plugin, mapping: mapping };
};

module.exports = PluginManager;
