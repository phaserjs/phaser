var Color = require('./Color');
var HueToComponent = require('./HueToComponent');

var HSLToColor = function (h, s, l)
{
    // achromatic by default
    var r = l;
    var g = l;
    var b = l;

    if (s !== 0)
    {
        var q = (l < 0.5) ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = HueToComponent(p, q, h + 1 / 3);
        g = HueToComponent(p, q, h);
        b = HueToComponent(p, q, h - 1 / 3);
    }

    var color = new Color();

    return color.setGLTo(r, g, b, 1);
};

module.exports = HSLToColor;
