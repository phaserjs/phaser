/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Checks if the given point falls between the two end-points of the line segment.
 *
 * @function Phaser.Geom.Intersects.PointToLine
 * @since 3.0.0
 *
 * @param {(Phaser.Geom.Point|any)} point - The point, or point-like object to check.
 * @param {Phaser.Geom.Line} line - The line segment to test for intersection on.
 *
 * @return {boolean} `true` if the two objects intersect, otherwise `false`.
 */
var PointToLine = function (point, line)
{
    return ((point.x - line.x1) * (line.y2 - line.y1) === (line.x2 - line.x1) * (point.y - line.y1));
};

module.exports = PointToLine;
