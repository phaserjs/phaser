/**
 * Given an alpha and 3 color values this will return an integer representation of it.
 *
 * @method getColor32
 * @param {integer} r - The red color component in the range 0 - 255.
 * @param {integer} g - The green color component in the range 0 - 255.
 * @param {integer} b - The blue color component in the range 0 - 255.
 * @return {integer} A native color value integer (format: 0xRRGGBB).
 */
var GetColor32 = function (red, green, blue, alpha)
{
    return alpha << 24 | red << 16 | green << 8 | blue;
};

module.exports = GetColor32;
