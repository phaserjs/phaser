var GetValue = require('./GetValue');
var Clamp = require('../../math/Clamp');

var GetMinMaxValue = function (source, key, min, max, defaultValue)
{
    if (defaultValue === undefined) { defaultValue = min; }

    var value = GetValue(source, key, defaultValue);

    return Clamp(value, min, max);
};

module.exports = GetMinMaxValue;
