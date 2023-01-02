/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Converts an RGB color value to HSV (hue, saturation and value).
 * Conversion formula from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes RGB values are contained in the set [0, 255] and returns h, s and v in the set [0, 1].
 * Based on code by Michael Jackson (https://github.com/mjijackson)
 *
 * @function Phaser.Display.Color.RGBToHSV
 * @since 3.0.0
 *
 * @param {number} r - The red color value. A number between 0 and 255.
 * @param {number} g - The green color value. A number between 0 and 255.
 * @param {number} b - The blue color value. A number between 0 and 255.
 * @param {(Phaser.Types.Display.HSVColorObject|Phaser.Display.Color)} [out] - An object to store the color values in. If not given an HSV Color Object will be created.
 *
 * @return {(Phaser.Types.Display.HSVColorObject|Phaser.Display.Color)} An object with the properties `h`, `s` and `v` set.
 */
var RGBToHSV = function (r, g, b, out)
{
    if (out === undefined) { out = { h: 0, s: 0, v: 0 }; }

    r /= 255;
    g /= 255;
    b /= 255;

    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var d = max - min;

    // achromatic by default
    var h = 0;
    var s = (max === 0) ? 0 : d / max;
    var v = max;

    if (max !== min)
    {
        if (max === r)
        {
            h = (g - b) / d + ((g < b) ? 6 : 0);
        }
        else if (max === g)
        {
            h = (b - r) / d + 2;
        }
        else if (max === b)
        {
            h = (r - g) / d + 4;
        }

        h /= 6;
    }

    if (out.hasOwnProperty('_h'))
    {
        out._h = h;
        out._s = s;
        out._v = v;
    }
    else
    {
        out.h = h;
        out.s = s;
        out.v = v;
    }

    return out;
};

module.exports = RGBToHSV;
