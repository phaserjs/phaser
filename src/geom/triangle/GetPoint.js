/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Point = require('../point/Point');
var Length = require('../line/Length');

//  Position is a value between 0 and 1
/**
 * [description]
 *
 * @function Phaser.Geom.Triangle.GetPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - [description]
 * @param {number} position - [description]
 * @param {(Phaser.Geom.Point|object)} [out] - [description]
 *
 * @return {(Phaser.Geom.Point|object)} [description]
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
