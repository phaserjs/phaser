var RotateAroundXY = require('./RotateAroundXY');
var InCenter = require('./InCenter');

var Rotate = function (triangle, angle)
{
    var point = InCenter(triangle);

    return RotateAroundXY(triangle, point.x, point.y, angle);
};

module.exports = Rotate;
