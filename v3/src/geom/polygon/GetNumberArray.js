/**
 * Export the points as an array of flat numbers, following the sequence [ x,y, x,y, x,y ]
 */
var GetNumberArray = function (polygon, output)
{
    if (output === undefined) { output = []; }

    for (var i = 0; i < polygon.points.length; i++)
    {
        output.push(polygon.points[i].x);
        output.push(polygon.points[i].y);
    }

    return output;
};

module.exports = GetNumberArray;
