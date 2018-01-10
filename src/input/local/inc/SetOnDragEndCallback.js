var SetOnDragEndCallback = function (gameObjects, callback, context)
{
    return this.setCallback(gameObjects, 'onDragEnd', callback, context);
};

module.exports = SetOnDragEndCallback;
