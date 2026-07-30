/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the fuzzy ceiling of the given value.
 *
 * Rounds the value up to the nearest integer, but subtracts a small epsilon tolerance
 * before applying `Math.ceil`. This means that values very slightly above an integer
 * boundary (within the epsilon range) are treated as if they were exactly on that
 * boundary, avoiding floating-point precision errors that would otherwise push the
 * result up to the next integer unexpectedly.
 *
 * @function Phaser.Math.Fuzzy.Ceil
 * @since 3.0.0
 *
 * @param {number} value - The value to compute the fuzzy ceiling of.
 * @param {number} [epsilon=0.0001] - The epsilon tolerance used to reduce floating-point precision errors.
 *
 * @return {number} The fuzzy ceiling of the value.
 */
var Ceil = function (value, epsilon)
{
    if (epsilon === undefined) { epsilon = 0.0001; }

    return Math.ceil(value - epsilon);
};

module.exports = Ceil;
