/**
* Adds the source and backdrop colors together and returns the value, up to a maximum of 255.
*
* @method Lazer.Color.blendAdd
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var Add = function (a, b)
{
    return Math.min(255, a + b);
};

module.exports = Add;
