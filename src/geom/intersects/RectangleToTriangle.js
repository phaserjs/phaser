/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var LineToRectangle = require('./LineToRectangle');

/**
 * Checks for intersection between Rectangle shape and Triangle shape.
 *
 * @function Phaser.Geom.Intersects.RectangleToTriangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - Rectangle object to test.
 * @param {Phaser.Geom.Triangle} triangle - Triangle object to test.
 * @param {array} [out] - An array in which to optionally store the points of intersection.
 *
 * @return {boolean} A value of `true` if objects intersect; otherwise `false`.
 */
var RectangleToTriangle = function (rect, triangle, out)
{
    if (out === undefined) { out = []; }

    if (triangle.left > rect.right ||
        triangle.right < rect.left ||
        triangle.top > rect.bottom ||
        triangle.bottom < rect.top)
    {
        return false;
    }

    var oriLength = out.length;

    var lineA = triangle.getLineA();
    var lineB = triangle.getLineB();
    var lineC = triangle.getLineC();

    var output = [ [], [], [] ];

    var res = [
        LineToRectangle(lineA, rect, output[0]),
        LineToRectangle(lineB, rect, output[1]),
        LineToRectangle(lineC, rect, output[2])
    ];

    for (var i = 0; i < 3; i++)
    {
        if (res[i] && output[i] !== []) { out.concat(output[i]); }
    }

    if (out.length - oriLength > 0) { return true; }
    else if (res[0] || res[1] || res[2]) { return true; }
    else { return false; }
};

module.exports = RectangleToTriangle;
