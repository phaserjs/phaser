/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Point = require('../point/Point');
var Equals = require('../circle/Equals');
var DistanceBetween = require('../../math/distance/DistanceBetween');

/**
 * Checks if two Circles intersect.
 *
 * @function Phaser.Geom.Intersects.CircleToCircle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circleA - The first Circle to check for intersection.
 * @param {Phaser.Geom.Circle} circleB - The second Circle to check for intersection.
 * @param {array} [out] - An array in which to optionally store the points of intersection.
 *
 * @return {boolean} `true` if the two Circles intersect, otherwise `false`.
 */
var CircleToCircle = function (circleA, circleB, out)
{
    if (out === undefined) { out = []; }

    var x0 = circleA.x;
    var y0 = circleA.y;
    var r0 = circleA.radius;

    var x1 = circleB.x;
    var y1 = circleB.y;
    var r1 = circleB.radius;

    // To optimise, if there's no intersection or if the two circles are identical, then we return false

    if (!(DistanceBetween(x0, y0, x1, y1) <= (r0 + r1))) { return false; }

    if (Equals(circleA, circleB)) { return false; }

    var a, b, c, lambda, x;

    if (y0 === y1)
    {
        x = (r1 * r1) - (r0 * r0) - (x1 * x1) + (x0 * x0);

        a = 1;
        b = -2 * y1;
        c = (x1 * x1) + (x * x) - (2 * x1 * x) + (y1 * y1) - (r1 * r1);

        lambda = (b * b) - (4 * a * c);

        if (lambda < 0) { return false; }
        else if (lambda === 0)
        {
            out.push(new Point(x, (-b / (2 * a))));
            return true;
        }
        else
        {
            out.push(new Point(x, (-b + Math.sqrt(lambda)) / (2 * a)));
            out.push(new Point(x, (-b - Math.sqrt(lambda)) / (2 * a)));
            return true;
        }
    }
    else
    {
        var v1 = (x0 - x1) / (y0 - y1);
        var n = (r1 * r1 - r0 * r0 - x1 * x1 + x0 * x0 - y1 * y1 + y0 * y0) / (2 * (y0 - y1));

        a = (v1 * v1) + 1;
        b = (2 * y0 * v1) - (2 * n * v1) - (2 * x0);
        c = (x0 * x0) + (y0 * y0) + (n * n) - (r0 * r0) - (2 * y0 * n);

        lambda = (b * b) - (4 * a * c);

        if (lambda < 0) { return false; }
        else if (lambda === 0)
        {
            x = (-b / (2 * a));
            out.push(new Point(x, (n - (x * v1))));
            return true;
        }
        else
        {
            x = (-b + Math.sqrt(lambda)) / (2 * a);
            out.push(new Point(x, (n - (x * v1))));
            x = (-b - Math.sqrt(lambda)) / (2 * a);
            out.push(new Point(x, (n - (x * v1))));
            return true;
        }
    }
};

module.exports = CircleToCircle;
