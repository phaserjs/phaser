var Color = require('./Color');

/**
* Converts a hex string into a Phaser Color object.
*
* The hex string can supplied as `'#0033ff'` or the short-hand format of `'#03f'`; it can begin with an optional "#" or "0x", or be unprefixed.    
*
* An alpha channel is _not_ supported.
*
* @method Phaser.Color.hexToColor
* @static
* @param {string} hex - The color string in a hex format.
* @param {object} [out] - An object into which 3 properties will be created or set: r, g and b. If not provided a new object will be created.
* @return {object} An object with the red, green and blue values set in the r, g and b properties.
*/
var HexStringToColor = function (hex)
{
    var color = new Color();

    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    hex = hex.replace(/^(?:#|0x)?([a-f\d])([a-f\d])([a-f\d])$/i, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^(?:#|0x)?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (result)
    {
        var r = parseInt(result[1], 16);
        var g = parseInt(result[2], 16);
        var b = parseInt(result[3], 16);

        color.setTo(r, g, b);
    }

    return color;
};

module.exports = HexStringToColor;
