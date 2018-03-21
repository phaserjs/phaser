/**
* Darkens or lightens the colors, depending on the source color value. 
* 
* If the source color is lighter than 0.5, the backdrop is lightened, as if it were dodged; 
* this is useful for adding highlights to a scene. 
* 
* If the source color is darker than 0.5, the backdrop is darkened, as if it were burned in. 
* The degree of lightening or darkening is proportional to the difference between the source color and 0.5; 
* if it is equal to 0.5, the backdrop is unchanged.
* 
* Painting with pure black or white produces a distinctly darker or lighter area, but does not result in pure black or white. 
* The effect is similar to shining a diffused spotlight on the backdrop. 
*
* @method Lazer.Color.blendSoftLight
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var SoftLight = function (a, b)
{
    return (b < 128) ? (2 * ((a >> 1) + 64)) * (b / 255) : 255 - (2 * (255 - ((a >> 1) + 64)) * (255 - b) / 255);
};

module.exports = SoftLight;
