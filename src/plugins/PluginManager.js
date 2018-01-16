var Class = require('../utils/Class');

var plugins = {};

var PluginManager = new Class({

    initialize:

    //  The PluginManager is global and belongs to the Game instance, not a Scene.
    function PluginManager (game, config)
    {
        this.game = game;
    },

    boot: function ()
    {
    },

    install: function (scene, globalPlugins, localPlugins)
    {
        var i;
        var pluginKey;
        var sys = scene.sys;

        for (var i = 0; i < globalPlugins.length; i++)
        {
            pluginKey = globalPlugins[i];
            
            sys.scene[pluginKey] = sys[pluginKey];
        }

        for (var i = 0; i < localPlugins.length; i++)
        {
            pluginKey = localPlugins[i];
            
            // console.log('installing', p);

            if (plugins[pluginKey])
            {
                //  Install a local reference inside of Systems
                sys[pluginKey] = new plugins[pluginKey](scene);
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

PluginManager.register = function (key, plugin)
{
    plugins[key] = plugin;

    // console.log('PluginManager.register', key);
};

module.exports = PluginManager;
