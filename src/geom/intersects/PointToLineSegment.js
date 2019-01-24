/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var PointToLine = require('./PointToLine');

/**
 * Checks if a Point is located on the given line segment.
 *
 * @function Phaser.Geom.Intersects.PointToLineSegment
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} point - The Point to check for intersection.
 * @param {Phaser.Geom.Line} line - The line segment to check for intersection.
 *
 * @return {boolean} `true` if the Point is on the given line segment, otherwise `false`.
 */
var PointToLineSegment = function (point, line)
{
    if (!PointToLine(point, line))
    {
        return false;
    }

    var xMin = Math.min(line.x1, line.x2);
    var xMax = Math.max(line.x1, line.x2);
    var yMin = Math.min(line.y1, line.y2);
    var yMax = Math.max(line.y1, line.y2);

    return ((point.x >= xMin && point.x <= xMax) && (point.y >= yMin && point.y <= yMax));
};

module.exports = PointToLineSegment;
