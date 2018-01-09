/**
* Multiplies the backdrop and source color values.
* The result color is always at least as dark as either of the two constituent
* colors. Multiplying any color with black produces black;
* multiplying with white leaves the original color unchanged.
*/
var Multiply = function (a, b)
{
    return (a * b) / 255;
};

module.exports = Multiply;
