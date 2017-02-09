/**
* Negation blend mode.
*
* @method Lazer.Color.blendNegation
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var Negation = function (a, b)
{
    return 255 - Math.abs(255 - a - b);
};

module.exports = Negation;
