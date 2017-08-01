var HSVToRGB = require('./HSVToRGB');

/**
* Get HSV color wheel values in an array which will be 360 elements in size.
*/
var HSVColorWheel = function (s, v)
{
    if (s === undefined) { s = 1; }
    if (v === undefined) { v = 1; }

    var colors = [];

    for (var c = 0; c <= 359; c++)
    {
        colors.push(HSVToRGB(c / 359, s, v));
    }

    return colors;
};

module.exports = HSVColorWheel;
