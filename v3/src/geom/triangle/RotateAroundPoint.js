var RotateAroundXY = require('./RotateAroundXY');

var RotateAroundPoint = function (triangle, point, angle)
{
    return RotateAroundXY(triangle, point.x, point.y, angle);
};

module.exports = RotateAroundPoint;
