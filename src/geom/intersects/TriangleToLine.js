/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Contains = require('../triangle/Contains');
var LineToLine = require('./LineToLine');

/**
 * [description]
 *
 * @function Phaser.Geom.Intersects.TriangleToLine
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - [description]
 * @param {Phaser.Geom.Line} line - [description]
 *
 * @return {boolean} [description]
 */
var TriangleToLine = function (triangle, line)
{
    //  If the Triangle contains either the start or end point of the line, it intersects
    if (Contains(triangle, line.getPointA()) || Contains(triangle, line.getPointB()))
    {
        return true;
    }

    //  Now check the line against each line of the Triangle
    if (LineToLine(triangle.getLineA(), line))
    {
        return true;
    }

    if (LineToLine(triangle.getLineB(), line))
    {
        return true;
    }

    if (LineToLine(triangle.getLineC(), line))
    {
        return true;
    }

    return false;
};

module.exports = TriangleToLine;
