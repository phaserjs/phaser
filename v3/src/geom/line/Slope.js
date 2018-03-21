var Slope = function (line)
{
    return (line.y2 - line.y1) / (line.x2 - line.x1);
};

module.exports = Slope;
