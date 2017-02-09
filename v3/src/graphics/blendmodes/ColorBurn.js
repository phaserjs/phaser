/**
* Darkens the backdrop color to reflect the source color.
* Painting with white produces no change. 
*
* @method Lazer.Color.blendColorBurn
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var ColorBurn = function (a, b)
{
    return (b === 0) ? b : Math.max(0, (255 - ((255 - a) << 8) / b));
};

module.exports = ColorBurn;
