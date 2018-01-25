/**
* Negation blend mode.
*/
var Negation = function (a, b)
{
    return 255 - Math.abs(255 - a - b);
};

module.exports = Negation;
