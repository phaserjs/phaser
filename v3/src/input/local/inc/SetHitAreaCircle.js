var Circle = require('../../../geom/circle/Circle');
var CircleContains = require('../../../geom/circle/Contains');

var SetHitAreaCircle = function (gameObjects, x, y, radius, callback)
{
    if (callback === undefined) { callback = CircleContains; }

    var shape = new Circle(x, y, radius);

    return this.setHitArea(gameObjects, shape, callback);
};

module.exports = SetHitAreaCircle;
