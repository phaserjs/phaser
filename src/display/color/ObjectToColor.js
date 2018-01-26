var Color = require('./Color');

/**
 * Converts an object containing `r`, `g`, `b` and `a` properties into a Color class instance.
 *
 * @function Phaser.Display.Color.ObjectToColor
 * @since 3.0.0
 *
 * @param {object} input - An object containing `r`, `g`, `b` and `a` properties in the range 0 to 255.
 *
 * @return {Phaser.Display.Color} A Color object.
 */
var ObjectToColor = function (input)
{
    return new Color(input.r, input.g, input.b, input.a);
};

module.exports = ObjectToColor;
