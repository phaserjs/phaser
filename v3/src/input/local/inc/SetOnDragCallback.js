var SetOnDragCallback = function (gameObjects, callback, context)
{
    return this.setCallback(gameObjects, 'onDrag', callback, context);
};

module.exports = SetOnDragCallback;
