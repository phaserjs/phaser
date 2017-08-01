var Add = require('./Add');

/**
* An alias for blendAdd, it simply sums the values of the two colors.
*/
var LinearDodge = function (a, b)
{
    return Add(a, b);
};

module.exports = LinearDodge;
