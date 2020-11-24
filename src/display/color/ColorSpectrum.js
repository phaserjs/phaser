/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetColor = require('./GetColor');

/**
 * Return an array of Colors in a Color Spectrum.
 *
 * @function Phaser.Display.Color.ColorSpectrum
 * @since 3.50.0
 *
 * @return {Phaser.Types.Display.ColorObject[]} An array containing 1024 elements, where each contains a Color Object.
 */
var ColorSpectrum = function ()
{
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

    return colors;
};

module.exports = ColorSpectrum;
