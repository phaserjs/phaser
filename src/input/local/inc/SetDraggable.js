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

        gameObject.input.draggable = value;

        var index = this._draggable.indexOf(gameObject);

        if (value && index === -1)
        {
            this._draggable.push(gameObject);
        }
        else if (!value && index > -1)
        {
            this._draggable.splice(index, 1);
        }
    }

    return this;
};

module.exports = SetDraggable;
