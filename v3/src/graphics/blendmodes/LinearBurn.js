var Subtract = require('./Subtract');

/**
* An alias for blendSubtract, it simply sums the values of the two colors and subtracts 255.
*/
var LinearBurn = function (a, b)
{
    return Subtract(a, b);
};

module.exports = LinearBurn;
