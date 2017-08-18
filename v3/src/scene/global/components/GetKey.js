var Scene = require('../../local/Scene');

//  private
var GetKey = function (key, sceneConfig)
{
    if (!key) { key = 'default'; }

    if (typeof sceneConfig === 'function')
    {
        return key;
    }
    else if (sceneConfig instanceof Scene)
    {
        key = sceneConfig.sys.settings.key;
    }
    else if (typeof sceneConfig === 'object' && sceneConfig.hasOwnProperty('key'))
    {
        key = sceneConfig.key;
    }

    //  By this point it's either 'default' or extracted from the Scene

    if (this.keys.hasOwnProperty(key))
    {
        throw new Error('Cannot add a Scene with duplicate key: ' + key);
    }
    else
    {
        return key;
    }
};

module.exports = GetKey;
