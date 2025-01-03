/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Apply `Math.ceil()` to each coordinate of the given Point.
 *
 * @function Phaser.Geom.Point.Floor
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [point,$return]
 *
 * @param {Phaser.Geom.Point} point - The Point to floor.
 *
 * @return {Phaser.Geom.Point} The Point with `Math.floor()` applied to its coordinates.
 */
var Floor = function (point)
{
    return point.setTo(Math.floor(point.x), Math.floor(point.y));
};

module.exports = Floor;
