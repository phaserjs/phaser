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
        var index = this._draggable.indexOf(gameObject);

        if (value)
        {
            //  Make draggable
            gameObject.input.draggable = true;

            if (index === -1)
            {
                this._draggable.push(gameObject);
            }
        }
        else
        {
            //  Disable drag
            gameObject.input.draggable = false;

            if (index === -1)
            {
                this._draggable.splice(index, 1);
            }
        }
    }

    return true;
};

module.exports = SetDraggable;
