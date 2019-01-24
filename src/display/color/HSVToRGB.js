/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetColor = require('./GetColor');

/**
 * Converts an HSV (hue, saturation and value) color value to RGB.
 * Conversion formula from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes HSV values are contained in the set [0, 1].
 * Based on code by Michael Jackson (https://github.com/mjijackson)
 *
 * @function Phaser.Display.Color.HSVToRGB
 * @since 3.0.0
 *
 * @param {number} h - The hue, in the range 0 - 1. This is the base color.
 * @param {number} s - The saturation, in the range 0 - 1. This controls how much of the hue will be in the final color, where 1 is fully saturated and 0 will give you white.
 * @param {number} v - The value, in the range 0 - 1. This controls how dark the color is. Where 1 is as bright as possible and 0 is black.
 * @param {(ColorObject|Phaser.Display.Color)} [out] - A Color object to store the results in. If not given a new ColorObject will be created.
 *
 * @return {(ColorObject|Phaser.Display.Color)} An object with the red, green and blue values set in the r, g and b properties.
 */
var HSVToRGB = function (h, s, v, out)
{
    if (s === undefined) { s = 1; }
    if (v === undefined) { v = 1; }

    var i = Math.floor(h * 6);
    var f = h * 6 - i;

    var p = Math.floor((v * (1 - s)) * 255);
    var q = Math.floor((v * (1 - f * s)) * 255);
    var t = Math.floor((v * (1 - (1 - f) * s)) * 255);

    v = Math.floor(v *= 255);

    var r = v;
    var g = v;
    var b = v;

    var c = i % 6;

    if (c === 0)
    {
        g = t;
        b = p;
    }
    else if (c === 1)
    {
        r = q;
        b = p;
    }
    else if (c === 2)
    {
        r = p;
        b = t;
    }
    else if (c === 3)
    {
        r = p;
        g = q;
    }
    else if (c === 4)
    {
        r = t;
        g = p;
    }
    else if (c === 5)
    {
        g = p;
        b = q;
    }

    if (!out)
    {
        return { r: r, g: g, b: b, color: GetColor(r, g, b) };
    }
    else if (out.setTo)
    {
        return out.setTo(r, g, b, out.alpha, false);
    }
    else
    {
        out.r = r;
        out.g = g;
        out.b = b;
        out.color = GetColor(r, g, b);

        return out;
    }
};

module.exports = HSVToRGB;
