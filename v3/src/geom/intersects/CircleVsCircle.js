var DistanceBetween = require('../../math/distance/DistanceBetween');

var CircleVsCircle = function (circleA, circleB)
{
    return (DistanceBetween(circleA.x, circleA.y, circleB.x, circleB.y) <= (circleA.radius + circleB.radius));
};

module.exports = CircleVsCircle;
