var SetOnOutCallback = function (gameObjects, callback, context)
{
    return this.setCallback(gameObjects, 'onOut', callback, context);
};

module.exports = SetOnOutCallback;
