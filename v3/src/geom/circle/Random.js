var Point = require('../point/Point');

/**
* Returns a uniformly distributed random point from anywhere within this Circle.
*/
var Random = function (circle, out)
{
    if (out === undefined) { out = new Point(); }

    var t = 2 * Math.PI * Math.random();
    var u = Math.random() + Math.random();
    var r = (u > 1) ? 2 - u : u;
    var x = r * Math.cos(t);
    var y = r * Math.sin(t);

    out.x = circle.x + (x * circle.radius);
    out.y = circle.y + (y * circle.radius);

    return out;
};

module.exports = Random;
