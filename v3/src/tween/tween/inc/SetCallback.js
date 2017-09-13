
var SetCallback = function (type, callback, params, scope)
{
    this.callbacks[type] = { func: callback, scope: scope, params: params };

    return this;
};

module.exports = SetCallback;
