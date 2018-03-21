var ComponentToHex = require('./ComponentToHex');

var RGBToString = function (r, g, b, a, prefix)
{
    if (a === undefined) { a = 255; }
    if (prefix === undefined) { prefix = '#'; }

    if (prefix === '#')
    {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    else
    {
        return '0x' + ComponentToHex(a) + ComponentToHex(r) + ComponentToHex(g) + ComponentToHex(b);
    }
};

module.exports = RGBToString;
