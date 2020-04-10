/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Point = require('../point/Point');
var Length = require('../line/Length');

/**
 * Returns a Point from around the perimeter of a Triangle.
 *
 * @function Phaser.Geom.Triangle.GetPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to get the point on its perimeter from.
 * @param {number} position - The position along the perimeter of the triangle. A value between 0 and 1.
 * @param {(Phaser.Geom.Point|object)} [out] - An option Point, or Point-like object to store the value in. If not given a new Point will be created.
 *
 * @return {(Phaser.Geom.Point|object)} A Point object containing the given position from the perimeter of the triangle.
 */
var GetPoint = function (triangle, position, out)
{
    if (out === undefined) { out = new Point(); }

    var line1 = triangle.getLineA();
    var line2 = triangle.getLineB();
    var line3 = triangle.getLineC();

    if (position <= 0 || position >= 1)
    {
        out.x = line1.x1;
        out.y = line1.y1;

        return out;
    }

    var length1 = Length(line1);
    var length2 = Length(line2);
    var length3 = Length(line3);

    var perimeter = length1 + length2 + length3;

    var p = perimeter * position;
    var localPosition = 0;

    //  Which line is it on?

    if (p < length1)
    {
        //  Line 1
        localPosition = p / length1;

        out.x = line1.x1 + (line1.x2 - line1.x1) * localPosition;
        out.y = line1.y1 + (line1.y2 - line1.y1) * localPosition;
    }
    else if (p > length1 + length2)
    {
        //  Line 3
        p -= length1 + length2;
        localPosition = p / length3;

        out.x = line3.x1 + (line3.x2 - line3.x1) * localPosition;
        out.y = line3.y1 + (line3.y2 - line3.y1) * localPosition;
    }
    else
    {
        //  Line 2
        p -= length1;
        localPosition = p / length2;

        out.x = line2.x1 + (line2.x2 - line2.x1) * localPosition;
        out.y = line2.y1 + (line2.y2 - line2.y1) * localPosition;
    }

    return out;
};

module.exports = GetPoint;
