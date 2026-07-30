/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Floors to some place comparative to a `base`, default is 10 for decimal place.
 *
 * The `place` is represented by the power applied to `base` to get that place.
 *
 * @function Phaser.Math.FloorTo
 * @since 3.0.0
 *
 * @param {number} value - The value to floor.
 * @param {number} [place=0] - The place to floor to.
 * @param {number} [base=10] - The base to floor in. Default is 10 for decimal.
 *
 * @return {number} The floored value.
 */
var FloorTo = function (value, place, base)
{
    if (place === undefined) { place = 0; }
    if (base === undefined) { base = 10; }

    var p = Math.pow(base, -place);

    return Math.floor(value * p) / p;
};

module.exports = FloorTo;
