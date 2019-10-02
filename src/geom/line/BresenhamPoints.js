/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Using Bresenham's line algorithm this will return an array of all coordinates on this line.
 *
 * The `start` and `end` points are rounded before this runs as the algorithm works on integers.
 *
 * @function Phaser.Geom.Line.BresenhamPoints
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The line.
 * @param {integer} [stepRate=1] - The optional step rate for the points on the line.
 * @param {array} [results] - An optional array to push the resulting coordinates into.
 *
 * @return {object[]} The array of coordinates on the line.
 */
var BresenhamPoints = function (line, stepRate, results)
{
    if (stepRate === undefined) { stepRate = 1; }
    if (results === undefined) { results = []; }

    var x1 = Math.round(line.x1);
    var y1 = Math.round(line.y1);
    var x2 = Math.round(line.x2);
    var y2 = Math.round(line.y2);

    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var sx = (x1 < x2) ? 1 : -1;
    var sy = (y1 < y2) ? 1 : -1;
    var err = dx - dy;

    results.push({ x: x1, y: y1 });

    var i = 1;

    while (!((x1 === x2) && (y1 === y2)))
    {
        var e2 = err << 1;

        if (e2 > -dy)
        {
            err -= dy;
            x1 += sx;
        }

        if (e2 < dx)
        {
            err += dx;
            y1 += sy;
        }

        if (i % stepRate === 0)
        {
            results.push({ x: x1, y: y1 });
        }

        i++;
    }

    return results;
};

module.exports = BresenhamPoints;
