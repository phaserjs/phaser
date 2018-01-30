var Class = require('../utils/Class');

var plugins = {};

var PluginManager = new Class({

    initialize:

    //  The PluginManager is global and belongs to the Game instance, not a Scene.
    function PluginManager (game)
    {
        this.game = game;

        game.events.once('boot', this.boot, this);
    },

    boot: function ()
    {
    },

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

            // console.log('PluginManager.local', pluginKey, 'to', source.mapping);

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

    remove: function (key)
    {
        delete plugins[key];
    },

    destroy: function ()
    {
        plugins = {};
    }

});

//  Static method called directly by the Plugins
//  Key is a reference used to get the plugin from the plugins object (i.e. InputPlugin)
//  Plugin is the object to instantiate to create the plugin
//  Mapping is what the plugin is injected into the Scene.Systems as (i.e. input)

PluginManager.register = function (key, plugin, mapping)
{
    plugins[key] = { plugin: plugin, mapping: mapping };

    // console.log('PluginManager.register', key, mapping);
};

module.exports = PluginManager;
