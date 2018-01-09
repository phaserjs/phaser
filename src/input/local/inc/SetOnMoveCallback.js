var SetOnMoveCallback = function (gameObjects, callback, context)
{
    return this.setCallback(gameObjects, 'onMove', callback, context);
};

module.exports = SetOnMoveCallback;
