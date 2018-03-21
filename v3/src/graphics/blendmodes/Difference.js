/**
* Subtracts the darker of the two constituent colors from the lighter.
* 
* Painting with white inverts the backdrop color; painting with black produces no change. 
*
* @method Lazer.Color.blendDifference
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var Difference = function (a, b)
{
    return Math.abs(a - b);
};

module.exports = Difference;
