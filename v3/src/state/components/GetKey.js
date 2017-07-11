var State = require('../State');

//  private
var GetKey = function (key, stateConfig)
{
    if (!key) { key = 'default'; }

    if (typeof stateConfig === 'function')
    {
        return key;
    }
    else if (stateConfig instanceof State)
    {
        key = stateConfig.sys.settings.key;
    }
    else if (typeof stateConfig === 'object' && stateConfig.hasOwnProperty('key'))
    {
        key = stateConfig.key;
    }

    //  By this point it's either 'default' or extracted from the State

    if (this.keys.hasOwnProperty(key))
    {
        throw new Error('Cannot add a State with duplicate key: ' + key);
    }
    else
    {
        return key;
    }
};

module.exports = GetKey;
