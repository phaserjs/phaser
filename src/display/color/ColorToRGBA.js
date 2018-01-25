/**
 * [description]
 *
 * @function Phaser.Display.Color.ColorToRGBA
 * @since 3.0.0
 *
 * @param {number} color - [description]
 */
var ColorToRGBA = function (color)
{
    var output = {
        r: color >> 16 & 0xFF,
        g: color >> 8 & 0xFF,
        b: color & 0xFF,
        a: 255
    };

    if (color > 16777215)
    {
        output.a = color >>> 24;
    }

    return output;
};

module.exports = ColorToRGBA;
