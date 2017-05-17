var SetEventCallback = function (type, callback, params, scope)
{
    var types = [ 'onStart', 'onUpdate', 'onRepeat', 'onComplete' ];

    if (types.indexOf(type) !== -1)
    {
        this.callbacks[type] = { callback: callback, scope: scope, params: params };
    }

    return this;
};

module.exports = SetEventCallback;
