/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetFastValue = require('../utils/object/GetFastValue');

/**
 * Builds an array of which plugins (not including physics plugins) should be activated for the given Scene.
 *
 * The function checks the Scene's own settings for a `plugins` array first. If one is defined, it takes
 * priority and is returned immediately. Otherwise, the global default Scene plugins registered with the
 * Plugin Manager are returned. If neither is available, an empty array is returned.
 *
 * @function Phaser.Scenes.GetScenePlugins
 * @since 3.0.0
 *
 * @param {Phaser.Scenes.Systems} sys - The Scene Systems object to check for plugins.
 *
 * @return {array} An array of plugin keys to activate for the Scene. Scene-level plugins take priority over global defaults. Returns an empty array if no plugins are configured.
 */
var GetScenePlugins = function (sys)
{
    var defaultPlugins = sys.plugins.getDefaultScenePlugins();

    var scenePlugins = GetFastValue(sys.settings, 'plugins', false);

    //  Scene Plugins always override Default Plugins
    if (Array.isArray(scenePlugins))
    {
        return scenePlugins;
    }
    else if (defaultPlugins)
    {
        return defaultPlugins;
    }
    else
    {
        //  No default plugins or plugins in this scene
        return [];
    }
};

module.exports = GetScenePlugins;
