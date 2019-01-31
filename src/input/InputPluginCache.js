/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetValue = require('../utils/object/GetValue');

//  Contains the plugins that Phaser uses globally and locally.
//  These are the source objects, not instantiated.
var inputPlugins = {};

/**
 * @typedef {object} InputPluginContainer
 *
 * @property {string} key - The unique name of this plugin in the input plugin cache.
 * @property {function} plugin - The plugin to be stored. Should be the source object, not instantiated.
 * @property {string} [mapping] - If this plugin is to be injected into the Input Plugin, this is the property key map used.
 */

/**
 * @namespace Phaser.Input.InputPluginCache
 */

var InputPluginCache = {};

/**
 * Static method called directly by the Core internal Plugins.
 * Key is a reference used to get the plugin from the plugins object (i.e. InputPlugin)
 * Plugin is the object to instantiate to create the plugin
 * Mapping is what the plugin is injected into the Scene.Systems as (i.e. input)
 *
 * @name Phaser.Input.InputPluginCache.register
 * @type {function}
 * @static
 * @since 3.10.0
 * 
 * @param {string} key - A reference used to get this plugin from the plugin cache.
 * @param {function} plugin - The plugin to be stored. Should be the core object, not instantiated.
 * @param {string} mapping - If this plugin is to be injected into the Input Plugin, this is the property key used.
 * @param {string} settingsKey - The key in the Scene Settings to check to see if this plugin should install or not.
 * @param {string} configKey - The key in the Game Config to check to see if this plugin should install or not.
 */
InputPluginCache.register = function (key, plugin, mapping, settingsKey, configKey)
{
    inputPlugins[key] = { plugin: plugin, mapping: mapping, settingsKey: settingsKey, configKey: configKey };
};

/**
 * Returns the input plugin object from the cache based on the given key.
 *
 * @name Phaser.Input.InputPluginCache.getCore
 * @type {function}
 * @static
 * @since 3.10.0
 * 
 * @param {string} key - The key of the input plugin to get.
 *
 * @return {InputPluginContainer} The input plugin object.
 */
InputPluginCache.getPlugin = function (key)
{
    return inputPlugins[key];
};

/**
 * Installs all of the registered Input Plugins into the given target.
 *
 * @name Phaser.Input.InputPluginCache.install
 * @type {function}
 * @static
 * @since 3.10.0
 * 
 * @param {Phaser.Input.InputPlugin} target - The target InputPlugin to install the plugins into.
 */
InputPluginCache.install = function (target)
{
    var sys = target.scene.sys;
    var settings = sys.settings.input;
    var config = sys.game.config;

    for (var key in inputPlugins)
    {
        var source = inputPlugins[key].plugin;
        var mapping = inputPlugins[key].mapping;
        var settingsKey = inputPlugins[key].settingsKey;
        var configKey = inputPlugins[key].configKey;

        if (GetValue(settings, settingsKey, config[configKey]))
        {
            target[mapping] = new source(target);
        }
    }
};

/**
 * Removes an input plugin based on the given key.
 *
 * @name Phaser.Input.InputPluginCache.remove
 * @type {function}
 * @static
 * @since 3.10.0
 * 
 * @param {string} key - The key of the input plugin to remove.
 */
InputPluginCache.remove = function (key)
{
    if (inputPlugins.hasOwnProperty(key))
    {
        delete inputPlugins[key];
    }
};

module.exports = InputPluginCache;
