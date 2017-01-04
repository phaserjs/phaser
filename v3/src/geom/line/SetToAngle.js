var SetToAngle = function (line, x, y, angle, length)
{
    line.x1 = x;
    line.y1 = y;

    line.x2 = x + (Math.cos(angle) * length);
    line.y2 = y + (Math.sin(angle) * length);

    return line;
};

module.exports = SetToAngle;
