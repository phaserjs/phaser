var ColorBurn = require('./ColorBurn');
var ColorDodge = require('./ColorDodge');

/**
* This blend mode combines Color Dodge and Color Burn (rescaled so that neutral colors become middle gray).
* Dodge applies when values in the top layer are lighter than middle gray, and burn to darker values.
* The middle gray is the neutral color. When color is lighter than this, this effectively moves the white point of the bottom 
* layer down by twice the difference; when it is darker, the black point is moved up by twice the difference. The perceived contrast increases.
*
* @method Lazer.Color.blendVividLight
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var VividLight = function (a, b)
{
    return (b < 128) ? ColorBurn(a, 2 * b) : ColorDodge(a, (2 * (b - 128)));
};

module.exports = VividLight;
