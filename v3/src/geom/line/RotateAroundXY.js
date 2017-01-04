
var RotateAroundXY = function (line, x, y, angle)
{
    var c = Math.cos(angle);
    var s = Math.sin(angle);

    var tx = line.x1 - x;
    var ty = line.y1 - y;

    line.x1 = tx * c - ty * s + x;
    line.y1 = tx * s + ty * c + y;

    tx = line.x2 - x;
    ty = line.y2 - y;

    line.x2 = tx * c - ty * s + x;
    line.y2 = tx * s + ty * c + y;

    return line;
};

module.exports = RotateAroundXY;
