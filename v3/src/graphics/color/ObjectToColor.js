var Color = require('./Color');

var ObjectToColor = function (input)
{
    return new Color(input.r, input.g, input.b, input.a);
};

module.exports = ObjectToColor;
