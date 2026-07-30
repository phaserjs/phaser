/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the speed required to cover a given distance in a given time.
 *
 * The distance is assumed to be in pixels and the time is given in seconds.
 * The result is returned as pixels per millisecond.
 *
 * @function Phaser.Math.GetSpeed
 * @since 3.0.0
 *
 * @param {number} distance - The distance to travel, in pixels.
 * @param {number} time - The time allowed to cover the distance, in seconds.
 *
 * @return {number} The speed required, in pixels per millisecond.
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
