var CONST = require('./const');

var EventListener = function (type, callback, scope, priority, once)
{
    return {
        type: type,
        callback: callback,
        scope: scope,
        priority: priority,
        once: once,
        state: CONST.LISTENER_PENDING
    };
};

module.exports = EventListener;
