/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Contains the plugins that Phaser uses globally and locally.
//  These are the source objects, not instantiated.
var corePlugins = {};

//  Contains the plugins that the dev has loaded into their game
//  These are the source objects, not instantiated.
var customPlugins = {};

var PluginCache = {};

/**
 * Static method called directly by the Core internal Plugins.
 * Key is a reference used to get the plugin from the plugins object (i.e. InputPlugin)
 * Plugin is the object to instantiate to create the plugin
 * Mapping is what the plugin is injected into the Scene.Systems as (i.e. input)
 *
 * @method Phaser.Plugins.PluginCache.register
 * @since 3.8.0
 * 
 * @param {string} key - [description]
 * @param {object} plugin - [description]
 * @param {string} mapping - [description]
 */
PluginCache.register = function (key, plugin, mapping, custom)
{
    if (custom === undefined) { custom = false; }

    corePlugins[key] = { plugin: plugin, mapping: mapping, custom: custom };
};

PluginCache.registerCustom = function (key, plugin, mapping)
{
    customPlugins[key] = { plugin: plugin, mapping: mapping };
};

PluginCache.hasCore = function (key)
{
    return corePlugins.hasOwnProperty(key);
}

PluginCache.hasCustom = function (key)
{
    return customPlugins.hasOwnProperty(key);
}

PluginCache.getCore = function (key)
{
    return corePlugins[key];
}

PluginCache.getCustom = function (key)
{
    return customPlugins[key];
}

PluginCache.getCustomClass = function (key)
{
    return (customPlugins.hasOwnProperty(key)) ? customPlugins[key].plugin : null;
}

PluginCache.removeCustom = function (key)
{
    if (customPlugins.hasOwnProperty(key))
    {
        delete customPlugins[key];
    }
}

module.exports = PluginCache;
