/**
* Checks whether the x and y coordinates are contained within this polygon.
*
* @method Phaser.Polygon#contains
* @param {number} x - The X value of the coordinate to test.
* @param {number} y - The Y value of the coordinate to test.
* @return {boolean} True if the coordinates are within this polygon, otherwise false.
*/
var Contains = function (polygon, x, y)
{
    //  Adapted from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html by Jonas Raoni Soares Silva

    var inside = false;

    for (var i = -1, j = polygon.points.length - 1; ++i < polygon.points.length; j = i)
    {
        var ix = polygon.points[i].x;
        var iy = polygon.points[i].y;

        var jx = polygon.points[j].x;
        var jy = polygon.points[j].y;

        if (((iy <= y && y < jy) || (jy <= y && y < iy)) && (x < (jx - ix) * (y - iy) / (jy - iy) + ix))
        {
            inside = !inside;
        }
    }

    return inside;
};

module.exports = Contains;
