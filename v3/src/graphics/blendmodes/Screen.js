/**
* Multiplies the complements of the backdrop and source color values, then complements the result.
* The result color is always at least as light as either of the two constituent colors. 
* Screening any color with white produces white; screening with black leaves the original color unchanged. 
*
* @method Lazer.Color.blendScreen
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var Screen = function (a, b)
{
    return 255 - (((255 - a) * (255 - b)) >> 8);
};

module.exports = Screen;
