/**
* Multiplies the backdrop and source color values.
* The result color is always at least as dark as either of the two constituent
* colors. Multiplying any color with black produces black;
* multiplying with white leaves the original color unchanged.
*
* @method Lazer.Color.blendMultiply
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var Multiply = function (a, b)
{
    return (a * b) / 255;
};

module.exports = Multiply;
