var Color = require('./Color');

/**
* Converts a CSS 'web' string into a Phaser Color object.
*
* The web string can be in the format `'rgb(r,g,b)'` or `'rgba(r,g,b,a)'` where r/g/b are in the range [0..255] and a is in the range [0..1].
*
* @method Phaser.Color.webToColor
* @static
* @param {string} web - The color string in CSS 'web' format.
* @param {object} [out] - An object into which 4 properties will be created: r, g, b and a. If not provided a new object will be created.
* @return {object} An object with the red, green, blue and alpha values set in the r, g, b and a properties.
*/
var RGBStringToColor = function (rgb)
{
    var color = new Color();

    var result = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?))?\s*\)$/.exec(rgb.toLowerCase());

    if (result)
    {
        var r = parseInt(result[1], 10);
        var g = parseInt(result[2], 10);
        var b = parseInt(result[3], 10);
        var a = (result[4] !== undefined) ? parseFloat(result[4]) : 1;

        color.setTo(r, g, b, a * 255);
    }

    return color;
};

module.exports = RGBStringToColor;
