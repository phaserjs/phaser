/**
 * Given 3 color values this will return an integer representation of it.
 */
/**
 * [description]
 *
 * @function Phaser.Display.Color.GetColor
 * @since 3.0.0
 *
 * @param {number} red - [description]
 * @param {number} green - [description]
 * @param {number} blue - [description]
 *
 * @return {number} [description]
 */
var GetColor = function (red, green, blue)
{
    return red << 16 | green << 8 | blue;
};

module.exports = GetColor;
