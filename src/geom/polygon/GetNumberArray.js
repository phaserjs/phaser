/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

// Export the points as an array of flat numbers, following the sequence [ x,y, x,y, x,y ]

/**
 * [description]
 *
 * @function Phaser.Geom.Polygon.GetNumberArray
 * @since 3.0.0
 *
 * @generic {number[]} O - [output,$return]
 *
 * @param {Phaser.Geom.Polygon} polygon - [description]
 * @param {(array|number[])} [output] - [description]
 *
 * @return {(array|number[])} [description]
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
