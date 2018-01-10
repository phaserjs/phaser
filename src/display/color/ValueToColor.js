var HexStringToColor = require('./HexStringToColor');
var IntegerToColor = require('./IntegerToColor');
var ObjectToColor = require('./ObjectToColor');
var RGBStringToColor = require('./RGBStringToColor');

var ValueToColor = function (input)
{
    var t = typeof input;

    switch (t)
    {
        case 'string':

            if (input.substr(0, 3).toLowerCase() === 'rgb')
            {
                return RGBStringToColor(input);
            }
            else
            {
                return HexStringToColor(input);
            }

            break;

        case 'number':

            return IntegerToColor(input);
            break;

        case 'object':

            return ObjectToColor(input);
            break;
    }
};

module.exports = ValueToColor;
