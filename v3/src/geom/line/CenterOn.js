
var CenterOn = function (line, x, y)
{
    var tx = x - ((line.x1 + line.x2) / 2);
    var ty = y - ((line.y1 + line.y2) / 2);

    line.x1 += tx;
    line.y1 += ty;

    line.x2 += tx;
    line.y2 += ty;

    return line;
};

module.exports = CenterOn;
