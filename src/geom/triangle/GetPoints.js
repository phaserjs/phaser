/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Length = require('../line/Length');
var Point = require('../point/Point');

/**
 * [description]
 *
 * @function Phaser.Geom.Triangle.GetPoints
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - [description]
 * @param {integer} quantity - [description]
 * @param {number} stepRate - [description]
 * @param {(array|Phaser.Geom.Point[])} out - [description]
 *
 * @return {(array|Phaser.Geom.Point[])} [description]
 */
var GetPoints = function (triangle, quantity, stepRate, out)
{
    if (out === undefined) { out = []; }

    var line1 = triangle.getLineA();
    var line2 = triangle.getLineB();
    var line3 = triangle.getLineC();

    var length1 = Length(line1);
    var length2 = Length(line2);
    var length3 = Length(line3);

    var perimeter = length1 + length2 + length3;

    //  If quantity is a falsey value (false, null, 0, undefined, etc) then we calculate it based on the stepRate instead.
    if (!quantity)
    {
        quantity = perimeter / stepRate;
    }

    for (var i = 0; i < quantity; i++)
    {
        var p = perimeter * (i / quantity);
        var localPosition = 0;

        var point = new Point();

        //  Which line is it on?

        if (p < length1)
        {
            //  Line 1
            localPosition = p / length1;

            point.x = line1.x1 + (line1.x2 - line1.x1) * localPosition;
            point.y = line1.y1 + (line1.y2 - line1.y1) * localPosition;
        }
        else if (p > length1 + length2)
        {
            //  Line 3
            p -= length1 + length2;
            localPosition = p / length3;

            point.x = line3.x1 + (line3.x2 - line3.x1) * localPosition;
            point.y = line3.y1 + (line3.y2 - line3.y1) * localPosition;
        }
        else
        {
            //  Line 2
            p -= length1;
            localPosition = p / length2;

            point.x = line2.x1 + (line2.x2 - line2.x1) * localPosition;
            point.y = line2.y1 + (line2.y2 - line2.y1) * localPosition;
        }

        out.push(point);
    }

    return out;
};

module.exports = GetPoints;
