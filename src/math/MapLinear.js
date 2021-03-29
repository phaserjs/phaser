/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Linear mapping from range <a1, a2> to range <b1, b2>
 *
 * For example:
 *
 * ```javascript
 * Phaser.Math.MapLinear(0.5, 0, 1, 0, 100) = 50
 * Phaser.Math.MapLinear(0.5, 0, 1, 0, 200) = 100
 * Phaser.Math.MapLinear(33, 0, 100, 0, 1) = 0.33
 * ```
 *
 * @function Phaser.Math.MapLinear
 * @since 3.55.0
 *
 * @param {number} x - The value to map
 * @param {number} a1 - First endpoint of the range <a1, a2>
 * @param {number} a2 - Final endpoint of the range <a1, a2>
 * @param {number} b1 - First endpoint of the range <b1, b2>
 * @param {number} b2 - Final endpoint of the range  <b1, b2>
 *
 * @return {number} The mapped value.
 */
var MapLinear = function (x, a1, a2, b1, b2)
{
    return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
};

module.exports = MapLinear;

