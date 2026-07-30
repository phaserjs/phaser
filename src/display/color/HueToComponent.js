/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculates a single RGB channel value from a hue offset and the two intermediate
 * lightness values used during HSL to RGB conversion. Call this function once for each
 * channel (red, green, and blue), passing the appropriate hue offset each time.
 * Based on code by Michael Jackson (https://github.com/mjijackson)
 *
 * @function Phaser.Display.Color.HueToComponent
 * @since 3.0.0
 *
 * @param {number} p - The first intermediate value derived from the lightness during HSL to RGB conversion.
 * @param {number} q - The second intermediate value derived from the lightness and saturation during HSL to RGB conversion.
 * @param {number} t - The hue offset for the color channel being calculated (red, green, or blue).
 *
 * @return {number} The RGB channel value for the given hue offset, in the range 0 to 1.
 */
var HueToComponent = function (p, q, t)
{
    if (t < 0)
    {
        t += 1;
    }

    if (t > 1)
    {
        t -= 1;
    }

    if (t < 1 / 6)
    {
        return p + (q - p) * 6 * t;
    }

    if (t < 1 / 2)
    {
        return q;
    }

    if (t < 2 / 3)
    {
        return p + (q - p) * (2 / 3 - t) * 6;
    }

    return p;
};

module.exports = HueToComponent;
