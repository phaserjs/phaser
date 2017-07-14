var Scene = require('../Scene');
var Systems = require('../Systems');
var NOOP = require('../../utils/NOOP');

var CreateSceneFromFunction = function (key, scene)
{
    // console.log('createSceneFromFunction', key);

    var newScene = new scene();

    if (newScene instanceof Scene)
    {
        // console.log('instanceof Scene');

        var configKey = newScene.sys.settings.key;

        if (configKey !== '')
        {
            key = configKey;
        }

        if (this.keys.hasOwnProperty(key))
        {
            throw new Error('Cannot add a Scene with duplicate key: ' + key);
        }

        return this.createSceneFromInstance(key, newScene);
    }
    else
    {
        newScene.sys = new Systems(newScene);

        newScene.sys.settings.key = key;

        newScene.sys.init(this.game);

        this.createSceneDisplay(newScene);

        //  Default required functions

        if (!newScene.init)
        {
            newScene.init = NOOP;
        }

        if (!newScene.preload)
        {
            newScene.preload = NOOP;
        }

        if (!newScene.create)
        {
            newScene.create = NOOP;
        }

        if (!newScene.shutdown)
        {
            newScene.shutdown = NOOP;
        }

        if (!newScene.update)
        {
            newScene.update = NOOP;
        }

        if (!newScene.render)
        {
            newScene.render = NOOP;
        }

        return newScene;
    }
};

module.exports = CreateSceneFromFunction;
