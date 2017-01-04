var PointToLine = function (point, line)
{
    return ((point.x - line.x1) * (line.y2 - line.y1) === (line.x2 - line.x1) * (point.y - line.y1));
};

module.exports = PointToLine;
