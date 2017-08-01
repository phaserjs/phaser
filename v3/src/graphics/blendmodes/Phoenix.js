/**
* Phoenix blend mode. This subtracts the lighter color from the darker color, and adds 255, giving a bright result.
*/
var Phoenix = function (a, b)
{
    return Math.min(a, b) - Math.max(a, b) + 255;
};

module.exports = Phoenix;
