var Contains = require('./Contains');

/**
* Checks whether the x and y coordinates are contained within this polygon.
*
* @method Phaser.Polygon#contains
* @param {number} x - The X value of the coordinate to test.
* @param {number} y - The Y value of the coordinate to test.
* @return {boolean} True if the coordinates are within this polygon, otherwise false.
*/
var ContainsPoint = function (polygon, point)
{
    return Contains(polygon, point.x, point.y);
};

module.exports = ContainsPoint;
