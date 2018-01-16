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

    install: function (scene, config)
    {
        var sys = scene.sys;

        for (var i = 0; i < config.length; i++)
        {
            var p = config[i];
            
            console.log('installing', p);

            if (plugins[p])
            {
                //  Install a local reference inside of Systems
                sys[p] = new plugins[p](scene);
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

    console.log('PluginManager.register', key);
};

module.exports = PluginManager;
