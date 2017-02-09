var Subtract = require('./Subtract');

/**
* An alias for blendSubtract, it simply sums the values of the two colors and subtracts 255.
*
* @method Lazer.Color.blendLinearBurn
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var LinearBurn = function (a, b)
{
    return Subtract(a, b);
};

module.exports = LinearBurn;
