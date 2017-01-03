var NormalizeRightHand = function (point)
{
    return point.setTo(point.y * -1, point.x);
};

module.exports = NormalizeRightHand;
