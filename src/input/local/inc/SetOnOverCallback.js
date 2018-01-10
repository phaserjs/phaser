var SetOnOverCallback = function (gameObjects, callback, context)
{
    return this.setCallback(gameObjects, 'onOver', callback, context);
};

module.exports = SetOnOverCallback;
