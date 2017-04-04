var Centroid = require('./Centroid');
var Offset = require('./Offset');

var CenterOn = function (triangle, x, y, centerFunc)
{
    if (centerFunc === undefined) { centerFunc = Centroid; }

    //  Get the center of the triangle
    var center = centerFunc(triangle);

    //  Difference
    var diffX = x - center.x;
    var diffY = y - center.y;

    return Offset(triangle, diffX, diffY);
};

module.exports = CenterOn;
