/**
* Brightens the backdrop color to reflect the source color. 
* Painting with black produces no change.
*/
var ColorDodge = function (a, b)
{
    return (b === 255) ? b : Math.min(255, ((a << 8) / (255 - b)));
};

module.exports = ColorDodge;
