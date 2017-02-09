var Add = require('./Add');

/**
* An alias for blendAdd, it simply sums the values of the two colors.
*
* @method Lazer.Color.blendLinearDodge
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var LinearDodge = function (a, b)
{
    return Add(a, b);
};

module.exports = LinearDodge;
