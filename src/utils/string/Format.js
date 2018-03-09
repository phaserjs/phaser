/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Takes a string and replaces instances of markers with values in the given array.
 * The markers take the form of `%1`, `%2`, etc. I.e.:
 *
 * `Format("The %1 is worth %2 gold", [ 'Sword', 500 ])`
 *
 * @function Phaser.Utils.String.Format
 * @since 3.0.0
 *
 * @param {string} string - The string containing the replacement markers.
 * @param {array} values - An array containing values that will replace the markers. If no value exists an empty string is inserted instead.
 *
 * @return {string} The string containing replaced values.
 */
var Format = function (string, values)
{
    return string.replace(/%([0-9]+)/g, function (s, n)
    {
        return values[Number(n) - 1];
    });
};

module.exports = Format;
