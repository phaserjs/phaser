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

        if (frame)
        {
            gameObject.input = new InteractiveObject(gameObject, new Rectangle(0, 0, frame.width, frame.height), callback);

            this.queueForInsertion(gameObject);
        }
    }

    return this;
};

module.exports = SetHitAreaFromTexture;
