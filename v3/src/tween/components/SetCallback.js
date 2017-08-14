var SetCallback = function (type, callback, params, scope)
{
    var types = [ 'onStart', 'onUpdate', 'onRepeat', 'onLoop', 'onComplete', 'onYoyo' ];

    if (types.indexOf(type) !== -1)
    {
        this.callbacks[type] = { func: callback, scope: scope, params: params };
    }

    return this;
};

module.exports = SetCallback;
