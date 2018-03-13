/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetFastValue = require('../utils/object/GetFastValue');

/**
 * Builds an array of which plugins (not including physics plugins) should be activated for the given Scene.
 *
 * @function Phaser.Scenes.GetScenePlugins
 * @since 3.0.0
 *
 * @param {Phaser.Scenes.Systems} sys - [description]
 *
 * @return {array} [description]
 */
var GetScenePlugins = function (sys)
{
    var defaultPlugins = sys.game.config.defaultPlugins;
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
