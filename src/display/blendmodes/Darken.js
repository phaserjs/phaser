/**
* Selects the darker of the backdrop and source colors.
*/
var Darken = function (a, b)
{
    return (b > a) ? a : b;
};

module.exports = Darken;
