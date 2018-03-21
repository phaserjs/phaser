/**
* Selects the darker of the backdrop and source colors.
*
* @method Lazer.Color.blendDarken
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var Darken = function (a, b)
{
    return (b > a) ? a : b;
};

module.exports = Darken;
