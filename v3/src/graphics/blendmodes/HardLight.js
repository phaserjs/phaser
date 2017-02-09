var Overlay = require('./Overlay');

/**
* Multiplies or screens the colors, depending on the source color value. 
* 
* If the source color is lighter than 0.5, the backdrop is lightened, as if it were screened; 
* this is useful for adding highlights to a scene. 
* 
* If the source color is darker than 0.5, the backdrop is darkened, as if it were multiplied; 
* this is useful for adding shadows to a scene. 
* 
* The degree of lightening or darkening is proportional to the difference between the source color and 0.5; 
* if it is equal to 0.5, the backdrop is unchanged.
* 
* Painting with pure black or white produces pure black or white. The effect is similar to shining a harsh spotlight on the backdrop. 
*
* @method Lazer.Color.blendHardLight
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var HardLight = function (a, b)
{
    return Overlay(b, a);
};

module.exports = HardLight;
