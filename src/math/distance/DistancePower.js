/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the distance between two sets of coordinates using the generalized power formula:
 * `sqrt((x2 - x1)^pow + (y2 - y1)^pow)`. When `pow` is `2` this is equivalent to standard
 * Euclidean distance. Increasing `pow` emphasizes larger axis differences.
 *
 * @function Phaser.Math.Distance.Power
 * @since 3.0.0
 *
 * @param {number} x1 - The x coordinate of the first point.
 * @param {number} y1 - The y coordinate of the first point.
 * @param {number} x2 - The x coordinate of the second point.
 * @param {number} y2 - The y coordinate of the second point.
 * @param {number} [pow=2] - The exponent applied to each axis difference. Defaults to `2`, which gives standard Euclidean distance.
 *
 * @return {number} The distance between the two points.
 */
var DistancePower = function (x1, y1, x2, y2, pow)
{
    if (pow === undefined) { pow = 2; }

    return Math.sqrt(Math.pow(x2 - x1, pow) + Math.pow(y2 - y1, pow));
};

module.exports = DistancePower;
