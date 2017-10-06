/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#createSceneFromInstance
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {Phaser.Scene} newScene - [description]
 *
 * @return {Phaser.Scene} [description]
 */
var CreateSceneFromInstance = function (key, newScene)
{
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

    return newScene;
};

module.exports = CreateSceneFromInstance;
