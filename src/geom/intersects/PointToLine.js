/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Florian Mertens
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Checks if the a Point falls between the two end-points of a Line, based on the given line thickness.
 *
 * Assumes that the line end points are circular, not square.
 *
 * @function Phaser.Geom.Intersects.PointToLine
 * @since 3.0.0
 *
 * @param {(Phaser.Geom.Point|any)} point - The point, or point-like object to check.
 * @param {Phaser.Geom.Line} line - The line segment to test for intersection on.
 * @param {number} [lineThickness=1] - The line thickness. Assumes that the line end points are circular.
 *
 * @return {boolean} `true` if the Point falls on the Line, otherwise `false`.
 */
var PointToLine = function (point, line, lineThickness)
{
    if (lineThickness === undefined) { lineThickness = 1; }

    var x1 = line.x1;
    var y1 = line.y1;

    var x2 = line.x2;
    var y2 = line.y2;

    var px = point.x;
    var py = point.y;

    var L2 = (((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));

    if (L2 === 0)
    {
        return false;
    }

    var r = (((px - x1) * (x2 - x1)) + ((py - y1) * (y2 - y1))) / L2;

    //  Assume line thickness is circular
    if (r < 0)
    {
        //  Outside line1
        return (Math.sqrt(((x1 - px) * (x1 - px)) + ((y1 - py) * (y1 - py))) <= lineThickness);
    }
    else if ((r >= 0) && (r <= 1))
    {
        //  On the line segment
        var s = (((y1 - py) * (x2 - x1)) - ((x1 - px) * (y2 - y1))) / L2;

        return (Math.abs(s) * Math.sqrt(L2) <= lineThickness);
    }
    else
    {
        //  Outside line2
        return (Math.sqrt(((x2 - px) * (x2 - px)) + ((y2 - py) * (y2 - py))) <= lineThickness);
    }
};

module.exports = PointToLine;
