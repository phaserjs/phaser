/**
* Return the component parts of a color as an Object with the properties alpha, red, green, blue.
*
* Alpha will only be set if it exists in the given color (0xAARRGGBB)
*/
var IntegerToRGB = function (color)
{
    if (color > 16777215)
    {
        //  The color value has an alpha component
        return {
            a: color >>> 24,
            r: color >> 16 & 0xFF,
            g: color >> 8 & 0xFF,
            b: color & 0xFF
        };
    }
    else
    {
        return {
            a: 255,
            r: color >> 16 & 0xFF,
            g: color >> 8 & 0xFF,
            b: color & 0xFF
        };
    }
};

module.exports = IntegerToRGB;
