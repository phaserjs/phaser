var LinearBurn = require('./LinearBurn');
var LinearDodge = require('./LinearDodge');

/**
* This blend mode combines Linear Dodge and Linear Burn (rescaled so that neutral colors become middle gray).
* Dodge applies to values of top layer lighter than middle gray, and burn to darker values.
* The calculation simplifies to the sum of bottom layer and twice the top layer, subtract 128. The contrast decreases.
*
* @method Lazer.Color.blendLinearLight
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var LinearLight = function (a, b)
{
    return (b < 128) ? LinearBurn(a, 2 * b) : LinearDodge(a, (2 * (b - 128)));
};

module.exports = LinearLight;
