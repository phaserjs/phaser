var Between = require('../../math/Between');

var RandomRGB = function (min, max)
{
    if (min === undefined) { min = 0; }
    if (max === undefined) { max = 255; }

    return {
        r: Between(min, max),
        g: Between(min, max),
        b: Between(min, max)
    };
};

module.exports = RandomRGB;
