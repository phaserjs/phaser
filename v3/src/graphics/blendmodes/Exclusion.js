/**
* Produces an effect similar to that of the Difference mode, but lower in contrast. 
* Painting with white inverts the backdrop color; painting with black produces no change. 
*
* @method Lazer.Color.blendExclusion
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var Exclusion =  function (a, b)
{
    return a + b - 2 * a * b / 255;
};

module.exports = Exclusion;
