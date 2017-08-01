/**
* Produces an effect similar to that of the Difference mode, but lower in contrast. 
* Painting with white inverts the backdrop color; painting with black produces no change. 
*/
var Exclusion =  function (a, b)
{
    return a + b - 2 * a * b / 255;
};

module.exports = Exclusion;
