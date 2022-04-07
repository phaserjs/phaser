/**
 * @author       samme
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the snake distance between two sets of coordinates (points).
 *
 * Snake distance (rectilinear distance, Manhattan distance) is the sum of the horizontal and vertical distances.
 * It's the effective distance when movement is allowed only horizontally or vertically (but not both).
 *
 * @function Phaser.Math.Distance.Snake
 * @since 3.22.0
 *
 * @param {number} x1 - The x coordinate of the first point.
 * @param {number} y1 - The y coordinate of the first point.
 * @param {number} x2 - The x coordinate of the second point.
 * @param {number} y2 - The y coordinate of the second point.
 *
 * @return {number} The distance between each point.
 */
var SnakeDistance = function (x1, y1, x2, y2)
{
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

module.exports = SnakeDistance;
