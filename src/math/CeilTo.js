/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Ceils a given value to the nearest multiple of a `base` raised to the power of `place`.
 *
 * The `place` is represented by the power applied to `base` to get that place.
 * For example, with the default base of 10, a `place` of 0 ceils to the nearest integer,
 * a `place` of 1 ceils to the nearest 0.1, and a `place` of -1 ceils to the nearest 10.
 *
 * @function Phaser.Math.CeilTo
 * @since 3.0.0
 *
 * @param {number} value - The value to ceil.
 * @param {number} [place=0] - The place to ceil to.
 * @param {number} [base=10] - The base to ceil in. Default is 10 for decimal.
 *
 * @return {number} The ceiled value.
 */
var CeilTo = function (value, place, base)
{
    if (place === undefined) { place = 0; }
    if (base === undefined) { base = 10; }

    var p = Math.pow(base, -place);

    return Math.ceil(value * p) / p;
};

module.exports = CeilTo;
