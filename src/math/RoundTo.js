/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Round a value to the given precision.
 * 
 * For example:
 * 
 * ```javascript
 * RoundTo(123.456, 0) = 123
 * RoundTo(123.456, 1) = 120
 * RoundTo(123.456, 2) = 100
 * ```
 * 
 * To round the decimal, i.e. to round to precision, pass in a negative `place`:
 * 
 * ```javascript
 * RoundTo(123.456789, 0) = 123
 * RoundTo(123.456789, -1) = 123.5
 * RoundTo(123.456789, -2) = 123.46
 * RoundTo(123.456789, -3) = 123.457
 * ```
 *
 * @function Phaser.Math.RoundTo
 * @since 3.0.0
 *
 * @param {number} value - The value to round.
 * @param {integer} [place=0] - The place to round to. Positive to round the units, negative to round the decimal.
 * @param {integer} [base=10] - The base to round in. Default is 10 for decimal.
 *
 * @return {number} The rounded value.
 */
var RoundTo = function (value, place, base)
{
    if (place === undefined) { place = 0; }
    if (base === undefined) { base = 10; }

    var p = Math.pow(base, -place);

    return Math.round(value * p) / p;
};

module.exports = RoundTo;
