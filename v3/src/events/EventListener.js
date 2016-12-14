var CONST = require('./const');

var EventListener = function (type, callback, priority, once)
{
    return {
        type: type,
        callback: callback,
        priority: priority,
        once: once,
        state: CONST.LISTENER_PENDING
    };
};

module.exports = EventListener;
