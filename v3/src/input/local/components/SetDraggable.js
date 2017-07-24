var SetDraggable = function (gameObjects, value)
{
    if (value === undefined) { value = true; }

    if (!Array.isArray(gameObjects))
    {
        gameObjects = [ gameObjects ];
    }

    for (var i = 0; i < gameObjects.length; i++)
    {
        var gameObject = gameObjects[i];
        var interactiveObject = gameObject.input;

        if (interactiveObject)
        {
            interactiveObject.draggable = value;
        }
    }

    return this;
};

module.exports = SetDraggable;
