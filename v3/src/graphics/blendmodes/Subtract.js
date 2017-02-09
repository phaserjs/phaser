/**
* Combines the source and backdrop colors and returns their value minus 255.
*
* @method Lazer.Color.blendSubtract
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var Subtract = function (a, b)
{
    return Math.max(0, a + b - 255);
};

module.exports = Subtract;
