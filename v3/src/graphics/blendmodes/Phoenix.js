/**
* Phoenix blend mode. This subtracts the lighter color from the darker color, and adds 255, giving a bright result.
*
* @method Lazer.Color.blendPhoenix
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var Phoenix = function (a, b)
{
    return Math.min(a, b) - Math.max(a, b) + 255;
};

module.exports = Phoenix;
