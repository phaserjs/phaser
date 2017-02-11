var RGBStringToColor = require('./RGBStringToColor');
var HexStringToColor = require('./HexStringToColor');
var IntegerToColor = require('./IntegerToColor');

var ValueToColor = function (input)
{
    if (typeof input === 'string')
    {
        if (input.substr(0, 3).toLowerCase() === 'rgb')
        {
            return RGBStringToColor(input);
        }
        else
        {
            return HexStringToColor(input);
        }
    }
    else if (typeof input === 'number')
    {
        return IntegerToColor(input);
    }
};

module.exports = ValueToColor;
