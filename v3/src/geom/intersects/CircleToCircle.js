var DistanceBetween = require('../../math/distance/DistanceBetween');

var CircleToCircle = function (circleA, circleB)
{
    return (DistanceBetween(circleA.x, circleA.y, circleB.x, circleB.y) <= (circleA.radius + circleB.radius));
};

module.exports = CircleToCircle;
