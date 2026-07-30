/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetColor = require('./GetColor');

/**
 * Returns an array of Color Objects representing a full color spectrum.
 *
 * The spectrum colors cycle through the hue wheel in the order: red, yellow, green, cyan, blue, violet, and back to red.
 *
 * By default this function will return an array with 1024 elements.
 *
 * However, you can reduce this to a smaller quantity if needed, by specifying the `limit` parameter.
 * When a limit smaller than 1024 is given, the colors are sampled evenly across the full spectrum so
 * the hue distribution remains uniform regardless of the array size.
 *
 * @function Phaser.Display.Color.ColorSpectrum
 * @since 3.50.0
 *
 * @param {number} [limit=1024] - How many colors should be returned? The maximum is 1024 but you can set a smaller quantity if required.
 *
 * @return {Phaser.Types.Display.ColorObject[]} An array containing `limit` parameter number of elements, where each contains a Color Object.
 */
var ColorSpectrum = function (limit)
{
    if (limit === undefined) { limit = 1024; }

    var colors = [];

    var range = 255;

    var i;
    var r = 255;
    var g = 0;
    var b = 0;

    //  Red to Yellow
    for (i = 0; i <= range; i++)
    {
        colors.push({ r: r, g: i, b: b, color: GetColor(r, i, b) });
    }

    g = 255;

    //  Yellow to Green
    for (i = range; i >= 0; i--)
    {
        colors.push({ r: i, g: g, b: b, color: GetColor(i, g, b) });
    }

    r = 0;

    //  Green to Blue
    for (i = 0; i <= range; i++, g--)
    {
        colors.push({ r: r, g: g, b: i, color: GetColor(r, g, i) });
    }

    g = 0;
    b = 255;

    //  Blue to Red
    for (i = 0; i <= range; i++, b--, r++)
    {
        colors.push({ r: r, g: g, b: b, color: GetColor(r, g, b) });
    }

    if (limit === 1024)
    {
        return colors;
    }
    else
    {
        var out = [];

        var t = 0;
        var inc = 1024 / limit;

        for (i = 0; i < limit; i++)
        {
            out.push(colors[Math.floor(t)]);

            t += inc;
        }

        return out;
    }
};

module.exports = ColorSpectrum;
