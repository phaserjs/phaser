/**
 * Given an alpha and 3 color values this will return an integer representation of it.
 */
/**
 * [description]
 *
 * @function Phaser.Display.Color.GetColor32
 * @since 3.0.0
 *
 * @param {number} red - [description]
 * @param {number} green - [description]
 * @param {number} blue - [description]
 * @param {number} alpha - [description]
 *
 * @return {number} [description]
 */
var GetColor32 = function (red, green, blue, alpha)
{
    return alpha << 24 | red << 16 | green << 8 | blue;
};

module.exports = GetColor32;
