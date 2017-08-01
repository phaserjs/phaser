/**
 * Given 3 color values this will return an integer representation of it.
 */
var GetColor = function (red, green, blue)
{
    return red << 16 | green << 8 | blue;
};

module.exports = GetColor;
