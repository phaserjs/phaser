var InteractiveObject = require('../../InteractiveObject');

var SetHitArea = function (gameObjects, shape, callback)
{
    if (shape === undefined)
    {
        return this.setHitAreaFromTexture(gameObjects);
    }

    if (!Array.isArray(gameObjects))
    {
        gameObjects = [ gameObjects ];
    }

    for (var i = 0; i < gameObjects.length; i++)
    {
        var gameObject = gameObjects[i];

        gameObject.input = new InteractiveObject(gameObject, shape, callback);

        this.queueForInsertion(gameObject);
    }

    return this;
};

module.exports = SetHitArea;
