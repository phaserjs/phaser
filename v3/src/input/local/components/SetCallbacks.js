var SetCallbacks = function (gameObjects, onDown, onUp, onOver, onOut, context)
{
    if (onDown)
    {
        this.setOnDownCallback(gameObjects, onDown, context);
    }

    if (onUp)
    {
        this.setOnDownCallback(gameObjects, onUp, context);
    }

    if (onOver)
    {
        this.setOnDownCallback(gameObjects, onOver, context);
    }

    if (onOut)
    {
        this.setOnDownCallback(gameObjects, onOut, context);
    }

    return this;
};

module.exports = SetCallbacks;
