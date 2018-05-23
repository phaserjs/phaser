/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Calculate the angle between two sets of coordinates (points).
 *
 * Calculates the angle of the vector from the first point to the second point.
 *
 * @function Phaser.Math.Angle.Between
 * @since 3.0.0
 *
 * @param {number} x1 - The x coordinate of the first point.
 * @param {number} y1 - The y coordinate of the first point.
 * @param {number} x2 - The x coordinate of the second point.
 * @param {number} y2 - The y coordinate of the second point.
 *
 * @return {number} The angle in radians.
 */
var Between = function (x1, y1, x2, y2)
{
    return Math.atan2(y2 - y1, x2 - x1);
};

module.exports = Between;
