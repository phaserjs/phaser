var InteractiveObject = require('../../InteractiveObject');
var Rectangle = require('../../../geom/rectangle/Rectangle');
var RectangleContains = require('../../../geom/rectangle/Contains');

var SetHitAreaFromTexture = function (gameObjects, callback)
{
    if (callback === undefined) { callback = RectangleContains; }

    if (!Array.isArray(gameObjects))
    {
        gameObjects = [ gameObjects ];
    }

    for (var i = 0; i < gameObjects.length; i++)
    {
        var gameObject = gameObjects[i];
        var frame = gameObject.frame;

        var width = 0;
        var height = 0;

        if (frame)
        {
            width = frame.realWidth;
            height = frame.realHeight;
        }
        else if (gameObject.width)
        {
            width = gameObject.width;
            height = gameObject.height;
        }

        if (width !== 0 && height !== 0)
        {
            gameObject.input = InteractiveObject(gameObject, new Rectangle(0, 0, width, height), callback);

            this.queueForInsertion(gameObject);
        }
    }

    return this;
};

module.exports = SetHitAreaFromTexture;
