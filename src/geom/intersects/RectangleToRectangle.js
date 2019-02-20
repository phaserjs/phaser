/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Equals = require('../rectangle/Equals');
var LineToRectangle = require('./LineToRectangle');

/**
 * Checks if two Rectangles intersect.
 *
 * A Rectangle intersects another Rectangle if any part of its bounds is within the other Rectangle's bounds. As such, the two Rectangles are considered "solid". A Rectangle with no width or no height will never intersect another Rectangle.
 *
 * @function Phaser.Geom.Intersects.RectangleToRectangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rectA - The first Rectangle to check for intersection.
 * @param {Phaser.Geom.Rectangle} rectB - The second Rectangle to check for intersection.
 * @param {array} [out] - An array in which to optionally store the points of intersection.
 *
 * @return {boolean} `true` if the two Rectangles intersect, otherwise `false`.
 */
var RectangleToRectangle = function (rectA, rectB, out)
{
    if (out === undefined) { out = []; }

    if (Equals(rectA, rectB)) { return false; }

    if (rectA.width <= 0 || rectA.height <= 0 || rectB.width <= 0 || rectB.height <= 0)
    {
        return false;
    }

    if (!(rectA.right < rectB.x || rectA.bottom < rectB.y || rectA.x > rectB.right || rectA.y > rectB.bottom))
    {
        var lineA = rectA.getLineA();
        var lineB = rectA.getLineB();
        var lineC = rectA.getLineC();
        var lineD = rectA.getLineD();

        var output = [ [], [], [], [] ];

        var res = [
            LineToRectangle(lineA, rectB, output[0]),
            LineToRectangle(lineB, rectB, output[1]),
            LineToRectangle(lineC, rectB, output[2]),
            LineToRectangle(lineD, rectB, output[3])
        ];

        for (var i = 0; i < 4; i++)
        {
            if (res[i] && output !== []) { out.concat(output[i]); }
        }

        return true;
    }
    return false;
};

module.exports = RectangleToRectangle;
