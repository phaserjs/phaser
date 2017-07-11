var CreateStateFromInstance = function (key, newState)
{
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

    return newState;
};

module.exports = CreateStateFromInstance;
