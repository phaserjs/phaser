/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Converts an RGB color value to HSV (hue, saturation and value).
 * Conversion forumla from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes RGB values are contained in the set [0, 255] and returns h, s and v in the set [0, 1].
 * Based on code by Michael Jackson (https://github.com/mjijackson)
 *
 * @function Phaser.Display.Color.RGBToHSV
 * @since 3.0.0
 *
 * @param {integer} r - The red color value. A number between 0 and 255.
 * @param {integer} g - The green color value. A number between 0 and 255.
 * @param {integer} b - The blue color value. A number between 0 and 255.
 *
 * @return {object} An object with the properties `h`, `s` and `v`.
 */
var RGBToHSV = function (r, g, b)
{
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

    return { h: h, s: s, v: v };
};

module.exports = RGBToHSV;
