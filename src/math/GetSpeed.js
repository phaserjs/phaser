/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate a per-ms speed from a distance and time (given in seconds).
 *
 * @function Phaser.Math.GetSpeed
 * @since 3.0.0
 *
 * @param {number} distance - The distance.
 * @param {number} time - The time, in seconds.
 *
 * @return {number} The speed, in distance per ms.
 *
 * @example
 * // 400px over 1 second is 0.4 px/ms
 * Phaser.Math.GetSpeed(400, 1) // -> 0.4
 */
var GetSpeed = function (distance, time)
{
    return (distance / time) / 1000;
};

module.exports = GetSpeed;
