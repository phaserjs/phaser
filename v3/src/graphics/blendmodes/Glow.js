var Reflect = require('./Reflect');

/**
* Glow blend mode. This mode is a variation of reflect mode with the source and backdrop colors swapped.
*
* @method Lazer.Color.blendGlow
* @static
* @param {integer} a - The source color to blend, in the range 1 to 255.
* @param {integer} b - The backdrop color to blend, in the range 1 to 255.
* @returns {integer} The blended color value, in the range 1 to 255.
*/
var Glow = function (a, b)
{
    return Reflect(b, a);
};

module.exports = Glow;
