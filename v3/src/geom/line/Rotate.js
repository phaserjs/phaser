var RotateAroundXY = require('./RotateAroundXY');

var Rotate = function (line, angle)
{
    var x = (line.x1 + line.x2) / 2;
    var y = (line.y1 + line.y2) / 2;

    return RotateAroundXY(line, x, y, angle);
};

module.exports = Rotate;
