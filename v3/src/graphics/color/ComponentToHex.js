/**
* Return a string containing a hex representation of the given color component.
*
* @param {integer} color - The color channel to get the hex value for, must be a value between 0 and 255.
* @return {string} A string of length 2 characters, i.e. 255 = ff, 100 = 64.
*/
var ComponentToHex = function (color)
{
    var hex = color.toString(16);

    return (hex.length === 1) ? '0' + hex : hex;
};

module.exports = ComponentToHex;
