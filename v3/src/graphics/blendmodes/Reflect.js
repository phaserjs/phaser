/**
* Reflect blend mode. This mode is useful when adding shining objects or light zones to images. 
*
* @method Lazer.Color.blendReflect
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var Reflect = function (a, b)
{
    return (b === 255) ? b : Math.min(255, (a * a / (255 - b)));
};

module.exports = Reflect;
