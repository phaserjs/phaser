var Equals = function (circle, toCompare)
{
    return (
        circle.x === toCompare.x &&
        circle.y === toCompare.y &&
        circle.radius === toCompare.radius
    );
};

module.exports = Equals;
