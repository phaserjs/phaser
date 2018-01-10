var Scene = require('../../local/Scene');

/**
 * Adds a new Scene into the SceneManager.
 * You must give each Scene a unique key by which you'll identify it.
 *
 * The `sceneConfig` can be:
 *
 * * A `Phaser.Scene` object, or an object that extends it.
 * * A plain JavaScript object
 * * A JavaScript ES6 Class that extends `Phaser.Scene`
 * * A JavaScript ES5 prototype based Class
 * * A JavaScript function
 *
 * If a function is given then a new Scene will be created by calling it.
 *
 * @method Phaser.Scenes.GlobalSceneManager#add
 * @since 3.0.0
 *
 * @param {string} key - A unique key used to reference the Scene, i.e. `MainMenu` or `Level1`.
 * @param {Phaser.Scene|object|function} sceneConfig - [description]
 * @param {boolean} [autoStart=false] - If `true` the Scene will be started immediately after being added.
 *
 * @return {Phaser.Scene} [description]
 */
var Add = function (key, sceneConfig, autoStart)
{
    if (autoStart === undefined) { autoStart = false; }

    //  if not booted, then put scene into a holding pattern
    if (!this.game.isBooted)
    {
        this._pending.push({
            index: this._pending.length,
            key: key,
            scene: sceneConfig,
            autoStart: autoStart
        });

        return;
    }

    // var ok = key;
    key = this.getKey(key, sceneConfig);

    var newScene;

    if (sceneConfig instanceof Scene)
    {
        newScene = this.createSceneFromInstance(key, sceneConfig);
    }
    else if (typeof sceneConfig === 'object')
    {
        sceneConfig.key = key;

        newScene = this.createSceneFromObject(key, sceneConfig);
    }
    else if (typeof sceneConfig === 'function')
    {
        newScene = this.createSceneFromFunction(key, sceneConfig);
    }

    //  Replace key in case the scene changed it
    key = newScene.sys.settings.key;

    this.keys[key] = newScene;

    this.scenes.push(newScene);

    if (autoStart || newScene.sys.settings.active)
    {
        if (this.game.isBooted)
        {
            this.start(key);
        }
        else
        {
            this._start.push(key);
        }
    }

    return newScene;
};

module.exports = Add;
