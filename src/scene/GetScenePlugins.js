var GetFastValue = require('../utils/object/GetFastValue');

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
