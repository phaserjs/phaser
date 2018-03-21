/**
* Brightens the backdrop color to reflect the source color. 
* Painting with black produces no change.
*
* @method Lazer.Color.blendColorDodge
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var ColorDodge = function (a, b)
{
    return (b === 255) ? b : Math.min(255, ((a << 8) / (255 - b)));
};

module.exports = ColorDodge;
