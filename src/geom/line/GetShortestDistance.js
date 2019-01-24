/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Florian Mertens
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Get the shortest distance from a Line to the given Point.
 *
 * @function Phaser.Geom.Line.GetShortestDistance
 * @since 3.16.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to get the distance from.
 * @param {(Phaser.Geom.Point|object)} point - The point to get the shortest distance to.
 *
 * @return {number} The shortest distance from the line to the point.
 */
var GetShortestDistance = function (line, point)
{
    var x1 = line.x1;
    var y1 = line.y1;

    var x2 = line.x2;
    var y2 = line.y2;

    var L2 = (((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));

    if (L2 === 0)
    {
        return false;
    }

    var s = (((y1 - point.y) * (x2 - x1)) - ((x1 - point.x) * (y2 - y1))) / L2;

    return Math.abs(s) * Math.sqrt(L2);
};

module.exports = GetShortestDistance;
