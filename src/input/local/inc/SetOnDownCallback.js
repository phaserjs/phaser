var SetOnDownCallback = function (gameObjects, callback, context)
{
    return this.setCallback(gameObjects, 'onDown', callback, context);
};

module.exports = SetOnDownCallback;
