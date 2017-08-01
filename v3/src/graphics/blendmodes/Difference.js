/**
* Subtracts the darker of the two constituent colors from the lighter.
* 
* Painting with white inverts the backdrop color; painting with black produces no change. 
*/
var Difference = function (a, b)
{
    return Math.abs(a - b);
};

module.exports = Difference;
