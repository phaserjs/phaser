/**
 * Given an alpha and 3 color values this will return an integer representation of it.
 */
var GetColor32 = function (red, green, blue, alpha)
{
    return alpha << 24 | red << 16 | green << 8 | blue;
};

module.exports = GetColor32;
