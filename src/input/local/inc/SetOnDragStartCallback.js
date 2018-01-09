var SetOnDragStartCallback = function (gameObjects, callback, context)
{
    return this.setCallback(gameObjects, 'onDragStart', callback, context);
};

module.exports = SetOnDragStartCallback;
