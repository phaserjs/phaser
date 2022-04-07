/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// Export the points as an array of flat numbers, following the sequence [ x,y, x,y, x,y ]

/**
 * Stores all of the points of a Polygon into a flat array of numbers following the sequence [ x,y, x,y, x,y ],
 * i.e. each point of the Polygon, in the order it's defined, corresponds to two elements of the resultant
 * array for the point's X and Y coordinate.
 *
 * @function Phaser.Geom.Polygon.GetNumberArray
 * @since 3.0.0
 *
 * @generic {number[]} O - [output,$return]
 *
 * @param {Phaser.Geom.Polygon} polygon - The Polygon whose points to export.
 * @param {(array|number[])} [output] - An array to which the points' coordinates should be appended.
 *
 * @return {(array|number[])} The modified `output` array, or a new array if none was given.
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
