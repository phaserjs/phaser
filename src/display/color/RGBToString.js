/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ComponentToHex = require('./ComponentToHex');

/**
 * Converts the color values into an HTML compatible color string, prefixed with either `#` or `0x`.
 *
 * @function Phaser.Display.Color.RGBToString
 * @since 3.0.0
 *
 * @param {integer} r - The red color value. A number between 0 and 255.
 * @param {integer} g - The green color value. A number between 0 and 255.
 * @param {integer} b - The blue color value. A number between 0 and 255.
 * @param {integer} [a=255] - The alpha value. A number between 0 and 255.
 * @param {string} [prefix=#] - The prefix of the string. Either `#` or `0x`.
 *
 * @return {string} A string-based representation of the color values.
 */
var RGBToString = function (r, g, b, a, prefix)
{
    if (a === undefined) { a = 255; }
    if (prefix === undefined) { prefix = '#'; }

    if (prefix === '#')
    {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    else
    {
        return '0x' + ComponentToHex(a) + ComponentToHex(r) + ComponentToHex(g) + ComponentToHex(b);
    }
};

module.exports = RGBToString;
