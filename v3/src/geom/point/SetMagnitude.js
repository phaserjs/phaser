var Normalize = require('./Normalize');
var Multiply = require('./Multiply');

var SetMagnitude = function (point, magnitude)
{
    Normalize(point);

    return Multiply(point, magnitude, magnitude);
};

module.exports = SetMagnitude;
