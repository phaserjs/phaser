/**
 * Export the points as an array of flat numbers, following the sequence [ x,y, x,y, x,y ]
 *
 * @method Phaser.Polygon#toNumberArray
 * @param {array} [output] - The array to append the points to. If not specified a new array will be created.
 * @return {array} The flattened array.
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
