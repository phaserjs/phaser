var VividLight = require('./VividLight');

/**
* Runs blendVividLight on the source and backdrop colors.
* If the resulting color is 128 or more, it receives a value of 255; if less than 128, a value of 0.
* Therefore, all blended pixels have red, green, and blue channel values of either 0 or 255.
* This changes all pixels to primary additive colors (red, green, or blue), white, or black.
*
* @method Lazer.Color.blendHardMix
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var HardMix = function (a, b)
{
    return (VividLight(a, b) < 128) ? 0 : 255;
};

module.exports = HardMix;
