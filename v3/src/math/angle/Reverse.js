var Normalize = require('./Normalize');

var Reverse = function (angle)
{
    return Normalize(angle + Math.PI);
};

module.exports = Reverse;
