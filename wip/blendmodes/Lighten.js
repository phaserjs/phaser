/**
* Selects the lighter of the backdrop and source colors.
*/
var Lighten = function (a, b)
{
    return (b > a) ? b : a;
};

module.exports = Lighten;
