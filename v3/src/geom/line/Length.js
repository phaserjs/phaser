var Length = function (line)
{
    return Math.sqrt((line.x2 - line.x1) * (line.x2 - line.x1) + (line.y2 - line.y1) * (line.y2 - line.y1));
};

module.exports = Length;
