var State = require('../State');

var CreateStateFromObject = function (key, stateConfig)
{
    var newState = new State(stateConfig);

    var configKey = newState.sys.settings.key;

    if (configKey !== '')
    {
        key = configKey;
    }
    else
    {
        newState.sys.settings.key = key;
    }

    newState.sys.init(this.game);

    this.createStateDisplay(newState);

    return this.setupCallbacks(newState, stateConfig);
};

module.exports = CreateStateFromObject;
