/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculates the fuzzy floor of the given value by adding a small epsilon before
 * flooring. This avoids floating-point precision issues where a value that should
 * mathematically be an integer (e.g. 2.9999999) floors incorrectly to the integer below.
 * Any value within epsilon of the next integer up will be floored to that integer.
 *
 * @function Phaser.Math.Fuzzy.Floor
 * @since 3.0.0
 *
 * @param {number} value - The value to calculate the fuzzy floor of.
 * @param {number} [epsilon=0.0001] - The epsilon value. Values within this distance of the next integer up are floored to that integer.
 *
 * @return {number} The fuzzy floor of the given value.
 */
var Floor = function (value, epsilon)
{
    if (epsilon === undefined) { epsilon = 0.0001; }

    return Math.floor(value + epsilon);
};

module.exports = Floor;
