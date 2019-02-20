/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var LineToCircle = require('./LineToCircle');

/**
 * Checks for intersection between a circle and a rectangle.
 *
 * @function Phaser.Geom.Intersects.CircleToRectangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - The circle to be checked.
 * @param {Phaser.Geom.Rectangle} rect - The rectangle to be checked.
 * @param {array} [out] - An array in which to optionally store the points of intersection.
 *
 * @return {boolean} `true` if the two objects intersect, otherwise `false`.
 */
var CircleToRectangle = function (circle, rect, out)
{
    if (out === undefined) { out = []; }

    var oriLength = out.length;

    var lineA = rect.getLineA();
    var lineB = rect.getLineB();
    var lineC = rect.getLineC();
    var lineD = rect.getLineD();

    var output = [ [], [], [], [] ];

    var res = [
        LineToCircle(lineA, circle, output[0]),
        LineToCircle(lineB, circle, output[1]),
        LineToCircle(lineC, circle, output[2]),
        LineToCircle(lineD, circle, output[3])
    ];

    for (var i = 0; i < 4; i++)
    {
        if (res[i] && output !== []) { out.concat(output[i]); }
    }

    if (out.length - oriLength > 0) { return true; }
    else if (res[0] || res[1] || res[2] || res[3]) { return true; }
    else { return false; }
};

module.exports = CircleToRectangle;
