/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Round a value to a given decimal place.
 *
 * @function Phaser.Math.RoundTo
 * @since 3.0.0
 *
 * @param {number} value - The value to round.
 * @param {integer} [place=0] - The place to round to.
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
