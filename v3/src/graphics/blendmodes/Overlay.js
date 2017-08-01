/**
* Multiplies or screens the colors, depending on the backdrop color.
* Source colors overlay the backdrop while preserving its highlights and shadows. 
* The backdrop color is not replaced, but is mixed with the source color to reflect the lightness or darkness of the backdrop.
*/
var Overlay = function (a, b)
{
    return (b < 128) ? (2 * a * b / 255) : (255 - 2 * (255 - a) * (255 - b) / 255);
};

module.exports = Overlay;
