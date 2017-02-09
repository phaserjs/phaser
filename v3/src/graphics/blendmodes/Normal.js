/**
* Blends the source color, ignoring the backdrop.
*
* @method Lazer.Color.blendNormal
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var Normal = function (a)
{
    return a;
};

module.exports = Normal;
