var RotateAroundXY = require('./RotateAroundXY');

var RotateAroundPoint = function (line, point, angle)
{
    return RotateAroundXY(line, point.x, point.y, angle);
};

module.exports = RotateAroundPoint;
