/**
* Darkens the backdrop color to reflect the source color.
* Painting with white produces no change. 
*/
var ColorBurn = function (a, b)
{
    return (b === 0) ? b : Math.max(0, (255 - ((255 - a) << 8) / b));
};

module.exports = ColorBurn;
