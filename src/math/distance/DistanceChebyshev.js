/**
 * @author       samme
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the Chebyshev distance between two sets of coordinates (points).
 *
 * Chebyshev distance (or chessboard distance) is the maximum of the horizontal and vertical distances.
 * It's the effective distance when movement can be horizontal, vertical, or diagonal.
 *
 * @function Phaser.Math.Distance.Chebyshev
 * @since 3.22.0
 *
 * @param {number} x1 - The x coordinate of the first point.
 * @param {number} y1 - The y coordinate of the first point.
 * @param {number} x2 - The x coordinate of the second point.
 * @param {number} y2 - The y coordinate of the second point.
 *
 * @return {number} The distance between each point.
 */
var ChebyshevDistance = function (x1, y1, x2, y2)
{
    return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
};

module.exports = ChebyshevDistance;
