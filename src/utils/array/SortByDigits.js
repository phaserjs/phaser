/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes the given array and runs a numeric sort on it, ignoring any non-digits that
 * may be in the entries.
 *
 * You should only run this on arrays containing strings.
 *
 * @function Phaser.Utils.Array.SortByDigits
 * @since 3.50.0
 *
 * @param {string[]} array - The input array of strings.
 *
 * @return {string[]} The sorted input array.
 */
var SortByDigits = function (array)
{
    var re = /\D/g;

    array.sort(function (a, b)
    {
        return (parseInt(a.replace(re, ''), 10) - parseInt(b.replace(re, ''), 10));
    });

    return array;
};

module.exports = SortByDigits;
