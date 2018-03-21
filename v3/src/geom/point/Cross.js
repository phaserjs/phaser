var Cross = function (pointA, pointB)
{
    return ((pointA.x * pointB.y) - (pointA.y * pointB.x));
};

module.exports = Cross;
