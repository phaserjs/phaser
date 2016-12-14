var Wrap = require('../Wrap');

var WrapDegrees = function (angle)
{
    return Wrap(angle, -180, 180);
};

module.exports = WrapDegrees;
