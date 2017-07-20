var Triangle = require('../../../geom/triangle/Triangle');
var TriangleContains = require('../../../geom/triangle/Contains');

var SetHitAreaTriangle = function (gameObjects, x1, y1, x2, y2, x3, y3, callback)
{
    if (callback === undefined) { callback = TriangleContains; }

    var shape = new Triangle(x1, y1, x2, y2, x3, y3);

    return this.setHitArea(gameObjects, shape, callback);
};

module.exports = SetHitAreaTriangle;
