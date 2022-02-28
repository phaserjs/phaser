/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetFastValue = require('../utils/object/GetFastValue');

/**
 * Builds an array of which plugins (not including physics plugins) should be activated for the given Scene.
 *
 * @function Phaser.Scenes.GetScenePlugins
 * @since 3.0.0
 *
 * @param {Phaser.Scenes.Systems} sys - The Scene Systems object to check for plugins.
 *
 * @return {array} An array of all plugins which should be activated, either the default ones or the ones configured in the Scene Systems object.
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
