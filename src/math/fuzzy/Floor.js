/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the fuzzy floor of the given value.
 *
 * @function Phaser.Math.Fuzzy.Floor
 * @since 3.0.0
 *
 * @param {number} value - The value.
 * @param {number} [epsilon=0.0001] - The epsilon.
 *
 * @return {number} The floor of the value.
 */
var Floor = function (value, epsilon)
{
    if (epsilon === undefined) { epsilon = 0.0001; }

    return Math.floor(value + epsilon);
};

module.exports = Floor;
