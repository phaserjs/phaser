var SetCallback = function (gameObjects, type, callback, context)
{
    if (this._validTypes.indexOf(type) === -1)
    {
        return this;
    }

    if (!Array.isArray(gameObjects))
    {
        gameObjects = [ gameObjects ];
    }

    for (var i = 0; i < gameObjects.length; i++)
    {
        var gameObject = gameObjects[i];

        if (gameObject.input)
        {
            gameObject.input[type] = callback;

            if (context)
            {
                gameObject.input.callbackContext = context;
            }
        }
    }

    return this;
};

module.exports = SetCallback;
