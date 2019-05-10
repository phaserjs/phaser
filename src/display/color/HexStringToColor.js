/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Color = require('./Color');

/**
 * Converts a hex string into a Phaser Color object.
 * 
 * The hex string can supplied as `'#0033ff'` or the short-hand format of `'#03f'`; it can begin with an optional "#" or "0x", or be unprefixed.
 *
 * An alpha channel is _not_ supported.
 *
 * @function Phaser.Display.Color.HexStringToColor
 * @since 3.0.0
 *
 * @param {string} hex - The hex color value to convert, such as `#0033ff` or the short-hand format: `#03f`.
 *
 * @return {Phaser.Display.Color} A Color object populated by the values of the given string.
 */
var HexStringToColor = function (hex)
{
    var color = new Color();

    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    hex = hex.replace(/^(?:#|0x)?([a-f\d])([a-f\d])([a-f\d])$/i, function (m, r, g, b)
    {
        return r + r + g + g + b + b;
    });

    var result = (/^(?:#|0x)?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex);

    if (result)
    {
        var r = parseInt(result[1], 16);
        var g = parseInt(result[2], 16);
        var b = parseInt(result[3], 16);

        color.setTo(r, g, b);
    }

    return color;
};

module.exports = HexStringToColor;
