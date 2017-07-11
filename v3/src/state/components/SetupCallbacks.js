var GetValue = require('../../utils/object/GetValue');
var NOOP = require('../../utils/NOOP');

var SetupCallbacks = function (state, stateConfig)
{
    if (stateConfig === undefined) { stateConfig = state; }

    //  Extract callbacks or set NOOP

    state.init = GetValue(stateConfig, 'init', NOOP);
    state.preload = GetValue(stateConfig, 'preload', NOOP);
    state.create = GetValue(stateConfig, 'create', NOOP);
    state.shutdown = GetValue(stateConfig, 'shutdown', NOOP);

    //  Game Loop level callbacks

    state.update = GetValue(stateConfig, 'update', NOOP);
    state.render = GetValue(stateConfig, 'render', NOOP);

    return state;
};

module.exports = SetupCallbacks;
