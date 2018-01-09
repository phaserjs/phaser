/**
* Multiplies the complements of the backdrop and source color values, then complements the result.
* The result color is always at least as light as either of the two constituent colors. 
* Screening any color with white produces white; screening with black leaves the original color unchanged. 
*/
var Screen = function (a, b)
{
    return 255 - (((255 - a) * (255 - b)) >> 8);
};

module.exports = Screen;
