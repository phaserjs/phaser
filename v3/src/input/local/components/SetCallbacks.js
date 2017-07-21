var GetFastValue = require('../../../utils/object/GetFastValue');

var SetCallbacks = function (gameObjects, config)
{
    var onDown = GetFastValue(config, 'onDown', null);
    var onUp = GetFastValue(config, 'onUp', null);
    var onOver = GetFastValue(config, 'onOver', null);
    var onOut = GetFastValue(config, 'onOut', null);
    var onMove = GetFastValue(config, 'onMove', null);
    var context = GetFastValue(config, 'context', null);

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

    if (onMove)
    {
        this.setOnMoveCallback(gameObjects, onMove, context);
    }

    return this;
};

module.exports = SetCallbacks;
