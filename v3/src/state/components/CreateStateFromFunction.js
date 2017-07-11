var State = require('../State');
var Systems = require('../Systems');
var NOOP = require('../../utils/NOOP');

var CreateStateFromFunction = function (key, state)
{
    // console.log('createStateFromFunction', key);

    var newState = new state();

    if (newState instanceof State)
    {
        // console.log('instanceof State');

        var configKey = newState.sys.settings.key;

        if (configKey !== '')
        {
            key = configKey;
        }

        if (this.keys.hasOwnProperty(key))
        {
            throw new Error('Cannot add a State with duplicate key: ' + key);
        }

        return this.createStateFromInstance(key, newState);
    }
    else
    {
        newState.sys = new Systems(newState);

        newState.sys.settings.key = key;

        newState.sys.init(this.game);

        this.createStateDisplay(newState);

        //  Default required functions

        if (!newState.init)
        {
            newState.init = NOOP;
        }

        if (!newState.preload)
        {
            newState.preload = NOOP;
        }

        if (!newState.create)
        {
            newState.create = NOOP;
        }

        if (!newState.shutdown)
        {
            newState.shutdown = NOOP;
        }

        if (!newState.update)
        {
            newState.update = NOOP;
        }

        if (!newState.render)
        {
            newState.render = NOOP;
        }

        return newState;
    }
};

module.exports = CreateStateFromFunction;
