var GetValue = require('../../../utils/object/GetValue');
var NOOP = require('../../../utils/NOOP');
var Scene = require('../../local/Scene');

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

    //  Extract callbacks or set NOOP

    var defaults = [ 'init', 'preload', 'create', 'shutdown', 'update', 'render' ];

    for (var i = 0; i < defaults.length; i++)
    {
        newScene[defaults[i]] = GetValue(sceneConfig, defaults[i], NOOP);
    }

    //  Now let's move across any other functions or properties that may exist

    /*
    scene: {
        preload: preload,
        create: create,
        extend: {
            hello: 1,
            test: 'atari',
            addImage: addImage
        }
    }
    */

    if (sceneConfig.hasOwnProperty('extend'))
    {
        for (var propertyKey in sceneConfig.extend)
        {
            if (defaults.indexOf(propertyKey) === -1)
            {
                newScene[propertyKey] = sceneConfig.extend[propertyKey];
            }
        }
    }

    return newScene;
};

module.exports = CreateSceneFromObject;
