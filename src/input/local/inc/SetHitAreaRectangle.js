var Rectangle = require('../../../geom/rectangle/Rectangle');
var RectangleContains = require('../../../geom/rectangle/Contains');

var SetHitAreaRectangle = function (gameObjects, x, y, width, height, callback)
{
    if (callback === undefined) { callback = RectangleContains; }

    var shape = new Rectangle(x, y, width, height);

    return this.setHitArea(gameObjects, shape, callback);
};

module.exports = SetHitAreaRectangle;
