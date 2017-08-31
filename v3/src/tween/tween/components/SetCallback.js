var Tween = require('../Tween');

var SetCallback = function (type, callback, params, scope)
{
    if (Tween.TYPES.indexOf(type) !== -1)
    {
        this.callbacks[type] = { func: callback, scope: scope, params: params };
    }

    return this;
};

module.exports = SetCallback;
