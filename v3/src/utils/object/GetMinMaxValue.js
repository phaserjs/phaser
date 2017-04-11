var GetObjectValue = require('./GetObjectValue');
var Clamp = require('../../math/Clamp');

var GetMinMaxValue = function (source, key, min, max, defaultValue)
{
    if (defaultValue === undefined) { defaultValue = min; }

    var value = GetObjectValue(source, key, defaultValue);

    return Clamp(value, min, max);
};

module.exports = GetMinMaxValue;
