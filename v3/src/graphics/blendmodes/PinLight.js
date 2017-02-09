var Darken = require('./Darken');
var Lighten = require('./Lighten');

/**
* If the backdrop color (light source) is lighter than 50%, the blendDarken mode is used, and colors lighter than the backdrop color do not change.
* If the backdrop color is darker than 50% gray, colors lighter than the blend color are replaced, and colors darker than the blend color do not change.
*
* @method Lazer.Color.blendPinLight
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var PinLight = function (a, b)
{
    return (b < 128) ? Darken(a, 2 * b) : Lighten(a, (2 * (b - 128)));
};

module.exports = PinLight;
