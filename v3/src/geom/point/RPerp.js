var RPerp = function (point)
{
    return point.setTo(point.y, -point.x);
};

module.exports = RPerp;
