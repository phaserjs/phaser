var GetColor = require('./GetColor');

/**
 * Converts an HSV (hue, saturation and value) color value to RGB.
 * Conversion formula from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes HSV values are contained in the set [0, 1] and returns r, g and b values in the set [0, 255].
 * Based on code by Michael Jackson (https://github.com/mjijackson)
 *
 * @method fromHSV
 * @param {number} h - The hue, in the range 0 - 1.
 * @param {number} s - The saturation, in the range 0 - 1.
 * @param {number} v - The value, in the range 0 - 1.
 * @return {BaseColor} This
 */
var HSVToRGB = function (h, s, v)
{
    if (s === undefined) { s = 1; }
    if (v === undefined) { v = 1; }

    var i = Math.floor(h * 6);
    var f = h * 6 - i;

    var p = Math.floor((v * (1 - s)) * 255);
    var q = Math.floor((v * (1 - f * s)) * 255);
    var t = Math.floor((v * (1 - (1 - f) * s)) * 255);

    v = Math.floor(v *= 255);

    var output = { r: v, g: v, b: v, color: 0 };

    var r = i % 6;

    if (r === 0)
    {
        output.g = t;
        output.b = p;
    }
    else if (r === 1)
    {
        output.r = q;
        output.b = p;
    }
    else if (r === 2)
    {
        output.r = p;
        output.b = t;
    }
    else if (r === 3)
    {
        output.r = p;
        output.g = q;
    }
    else if (r === 4)
    {
        output.r = t;
        output.g = p;
    }
    else if (r === 5)
    {
        output.g = p;
        output.b = q;
    }

    output.color = GetColor(output.r, output.g, output.b);

    return output;
};

module.exports = HSVToRGB;
