var Scene = require('../Scene');

/**
* Adds a new Scene into the GlobalSceneManager. You must give each Scene a unique key by which you'll identify it.
* The Scene can be either a Phaser.Scene object (or an object that extends it), a plain JavaScript object or a function.
* If a function is given a new scene object will be created by calling it.
*
* @method Phaser.GlobalSceneManager#add
* @param {string} key - A unique key you use to reference this scene, i.e. "MainMenu", "Level1".
* @param {Phaser.Scene|object|function} scene  - The scene you want to switch to.
* @param {boolean} [autoStart=false]  - If true the Scene will be started immediately after adding it.
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

        // console.log('GlobalSceneManager not yet booted, adding to list', this._pending.length);

        return;
    }

    // var ok = key;
    key = this.getKey(key, sceneConfig);

    // console.group('GlobalSceneManager.add');
    // console.log('add key:', ok);
    // console.log('config key:', key);
    // console.log('config:', sceneConfig);
    // console.log('autoStart:', autoStart);
    // console.groupEnd();

    var newScene;

    if (sceneConfig instanceof Scene)
    {
        // console.log('GlobalSceneManager.add from instance:', key);

        newScene = this.createSceneFromInstance(key, sceneConfig);
    }
    else if (typeof sceneConfig === 'object')
    {
        // console.log('GlobalSceneManager.add from object:', key);

        sceneConfig.key = key;

        newScene = this.createSceneFromObject(key, sceneConfig);
    }
    else if (typeof sceneConfig === 'function')
    {
        // console.log('GlobalSceneManager.add from function:', key);

        newScene = this.createSceneFromFunction(key, sceneConfig);
    }

    //  Replace key in case the scene changed it
    key = newScene.sys.settings.key;

    // console.log('replaced key', key);

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
