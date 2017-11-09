var DistanceBetween = require('../../../math/distance/DistanceBetween');

var Furthest = function (source)
{
    var bodies = this.tree.all();

    var max = -1;
    var farthest = null;
    var x = source.x;
    var y = source.y;

    for (var i = bodies.length - 1; i >= 0; i--)
    {
        var target = bodies[i];
        var distance = DistanceBetween(x, y, target.x, target.y);

        if (distance > max)
        {
            farthest = target;
            max = distance;
        }
    }

    return farthest;
};

module.exports = Furthest;
