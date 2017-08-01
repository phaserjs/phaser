/**
* Combines the source and backdrop colors and returns their value minus 255.
*/
var Subtract = function (a, b)
{
    return Math.max(0, a + b - 255);
};

module.exports = Subtract;
