var DistanceBetween = require('../../../math/distance/DistanceBetween');

var Closest = function (source)
{
    var bodies = this.tree.all();

    var min = Number.MAX_VALUE;
    var closest = null;
    var x = source.x;
    var y = source.y;

    for (var i = bodies.length - 1; i >= 0; i--)
    {
        var target = bodies[i];
        var distance = DistanceBetween(x, y, target.x, target.y);

        if (distance < min)
        {
            closest = target;
            min = distance;
        }
    }

    return closest;
};

module.exports = Closest;
