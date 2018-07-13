/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Point = require('../point/Point');

//  This is based off an explanation and expanded math presented by Paul Bourke:
//  See http:'local.wasp.uwa.edu.au/~pbourke/geometry/lineline2d/

/**
 * [description]
 *
 * @function Phaser.Geom.Intersects.LineToLine
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line1 - [description]
 * @param {Phaser.Geom.Line} line2 - [description]
 * @param {Phaser.Geom.Point} [out] - [description]
 *
 * @return {boolean} [description]
 */
var LineToLine = function (line1, line2, out)
{
    if (out === undefined) { out = new Point(); }

    var x1 = line1.x1;
    var y1 = line1.y1;
    var x2 = line1.x2;
    var y2 = line1.y2;

    var x3 = line2.x1;
    var y3 = line2.y1;
    var x4 = line2.x2;
    var y4 = line2.y2;

    var numA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
    var numB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
    var deNom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    //  Make sure there is not a division by zero - this also indicates that the lines are parallel.
    //  If numA and numB were both equal to zero the lines would be on top of each other (coincidental).
    //  This check is not done because it is not necessary for this implementation (the parallel check accounts for this).

    if (deNom === 0)
    {
        return false;
    }

    //  Calculate the intermediate fractional point that the lines potentially intersect.

    var uA = numA / deNom;
    var uB = numB / deNom;

    //  The fractional point will be between 0 and 1 inclusive if the lines intersect.
    //  If the fractional calculation is larger than 1 or smaller than 0 the lines would need to be longer to intersect.

    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1)
    {
        out.x = x1 + (uA * (x2 - x1));
        out.y = y1 + (uA * (y2 - y1));

        return true;
    }

    return false;
};

module.exports = LineToLine;
