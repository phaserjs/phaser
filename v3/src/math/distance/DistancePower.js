var DistancePower = function (x1, y1, x2, y2, pow)
{
    if (pow === undefined) { pow = 2; }

    return Math.sqrt(Math.pow(x2 - x1, pow) + Math.pow(y2 - y1, pow));
};

module.exports = DistancePower;
