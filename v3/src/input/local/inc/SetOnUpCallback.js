var SetOnUpCallback = function (gameObjects, callback, context)
{
    return this.setCallback(gameObjects, 'onUp', callback, context);
};

module.exports = SetOnUpCallback;
