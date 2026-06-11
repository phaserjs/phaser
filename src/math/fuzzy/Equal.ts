/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Check whether the given values are fuzzily equal.
 *
 * Two numbers are fuzzily equal if their difference is less than `epsilon`.
 *
 * @function Phaser.Math.Fuzzy.Equal
 * @since 3.0.0
 *
 * @param a - The first value.
 * @param b - The second value.
 * @param epsilon - The maximum absolute difference below which the two values are considered equal.
 * @returns `true` if the values are fuzzily equal, otherwise `false`.
 */
export function Equal (a: number, b: number, epsilon: number = 0.0001): boolean
{
    return Math.abs(a - b) < epsilon;
}

export default Equal;
