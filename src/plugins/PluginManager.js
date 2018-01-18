var Class = require('../utils/Class');

var plugins = {};

var PluginManager = new Class({

    initialize:

    //  The PluginManager is global and belongs to the Game instance, not a Scene.
    function PluginManager (game, config)
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
            
            sys[pluginKey] = game[pluginKey];

            //  Scene level injection
            if (map.hasOwnProperty(pluginKey))
            {
                scene[map[pluginKey]] = sys[pluginKey];
            }
        }
    },

    installLocal: function (sys, scenePlugins)
    {
        var scene = sys.scene;
        var map = sys.settings.map;

        for (var i = 0; i < scenePlugins.length; i++)
        {
            var pluginKey = scenePlugins[i];

            var source = plugins[pluginKey];

            // console.log('PluginManager.local', pluginKey, 'to', source.mapping);
            
            sys[source.mapping] = new source.plugin(scene);

            //  Scene level injection
            if (map.hasOwnProperty(source.mapping))
            {
                scene[map[source.mapping]] = sys[source.mapping];
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
