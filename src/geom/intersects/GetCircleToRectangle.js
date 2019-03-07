/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetLineToCircle = require('./GetLineToCircle');
var CircleToRectangle = require('./CircleToRectangle');

/**
 * Checks for intersection between a circle and a rectangle,
 * and returns the intersection points as a Point object array.
 *
 * @function Phaser.Geom.Intersects.GetCircleToRectangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - The circle to be checked.
 * @param {Phaser.Geom.Rectangle} rect - The rectangle to be checked.
 * @param {array} [out] - An optional array in which to store the points of intersection.
 *
 * @return {array} An array with the points of intersection if objects intersect, otherwise an empty array.
 */
var GetCircleToRectangle = function (circle, rect, out)
{
    if (out === undefined) { out = []; }

    if (CircleToRectangle(circle, rect))
    {
        var lineA = rect.getLineA();
        var lineB = rect.getLineB();
        var lineC = rect.getLineC();
        var lineD = rect.getLineD();

        var output = [ [], [], [], [] ];

        var result = [
            GetLineToCircle(lineA, circle, output[0]),
            GetLineToCircle(lineB, circle, output[1]),
            GetLineToCircle(lineC, circle, output[2]),
            GetLineToCircle(lineD, circle, output[3])
        ];

        for (var i = 0; i < 4; i++)
        {
            if (result[i] && output !== []) { out.concat(output[i]); }
        }
    }

    return out;
};

module.exports = GetCircleToRectangle;
