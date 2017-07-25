var SetDraggable = function (gameObjects, value)
{
    if (value === undefined) { value = true; }

    if (!Array.isArray(gameObjects))
    {
        gameObjects = [ gameObjects ];
    }

    for (var i = 0; i < gameObjects.length; i++)
    {
        gameObjects[i].input.draggable = value;
    }

    return this;
};

module.exports = SetDraggable;
