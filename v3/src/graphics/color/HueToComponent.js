/**
* Converts a hue to an RGB color.
* Based on code by Michael Jackson (https://github.com/mjijackson)
*
* @method Lazer.Color.hueToColor
* @param {number} p
* @param {number} q
* @param {number} t
* @return {number} The color component value.
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

module.export = HueToComponent;
