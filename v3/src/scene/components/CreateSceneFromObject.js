var Scene = require('../Scene');

var CreateSceneFromObject = function (key, sceneConfig)
{
    var newScene = new Scene(sceneConfig);

    var configKey = newScene.sys.settings.key;

    if (configKey !== '')
    {
        key = configKey;
    }
    else
    {
        newScene.sys.settings.key = key;
    }

    newScene.sys.init(this.game);

    this.createSceneDisplay(newScene);

    return this.setupCallbacks(newScene, sceneConfig);
};

module.exports = CreateSceneFromObject;
