var Color = require('./Color');
var IntegerToRGB = require('./IntegerToRGB');

var IntegerToColor = function (input)
{
    var rgb = IntegerToRGB(input);

    return new Color(rgb.r, rgb.g, rgb.b, rgb.a);
};

module.exports = IntegerToColor;
