/**
* Converts an RGB color value to HSV (hue, saturation and value).
* Conversion forumla from http://en.wikipedia.org/wiki/HSL_color_space.
* Assumes RGB values are contained in the set [0, 255] and returns h, s and v in the set [0, 1].
* Based on code by Michael Jackson (https://github.com/mjijackson)
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
