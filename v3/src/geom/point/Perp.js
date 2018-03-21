var Perp = function (point)
{
    return point.setTo(-point.y, point.x);
};

module.exports = Perp;
