/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Capitalizes the first letter of a string if there is one.
 * @example
 * UppercaseFirst('abc');
 * // returns 'Abc'
 * @example
 * UppercaseFirst('the happy family');
 * // returns 'The happy family'
 * @example
 * UppercaseFirst('');
 * // returns ''
 *
 * @function Phaser.Utils.String.UppercaseFirst
 * @since 3.0.0
 *
 * @param {string} str - The string to capitalize.
 *
 * @return {string} A new string, same as the first, but with the first letter capitalized.
 */
var UppercaseFirst = function (str)
{
    return str && str[0].toUpperCase() + str.slice(1);
};

module.exports = UppercaseFirst;
