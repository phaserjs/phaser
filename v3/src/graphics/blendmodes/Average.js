/**
* Takes the average of the source and backdrop colors.
*
* @method Lazer.Color.blendAverage
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var Average = function (a, b)
{
    return (a + b) / 2;
};

module.exports = Average;
