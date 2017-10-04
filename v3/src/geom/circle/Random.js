var Point = require('../point/Point');

/**
 * Returns a uniformly distributed random point from anywhere within the given Circle.
 *
 * @function Phaser.Geom.Circle.Random
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - [description]
 * @param {Phaser.Geom.Point|object} [out] - [description]
 * @return {Phaser.Geom.Point|object} [description]
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
