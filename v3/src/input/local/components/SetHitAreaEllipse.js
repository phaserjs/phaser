var Ellipse = require('../../../geom/ellipse/Ellipse');
var EllipseContains = require('../../../geom/ellipse/Contains');

var SetHitAreaEllipse = function (gameObjects, x, y, width, height, callback)
{
    if (callback === undefined) { callback = EllipseContains; }

    var shape = new Ellipse(x, y, width, height);

    return this.setHitArea(gameObjects, shape, callback);
};

module.exports = SetHitAreaEllipse;
