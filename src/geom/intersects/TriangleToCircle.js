/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var LineToCircle = require('./LineToCircle');
var Contains = require('../triangle/Contains');

/**
 * [description]
 *
 * @function Phaser.Geom.Intersects.TriangleToCircle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - [description]
 * @param {Phaser.Geom.Circle} circle - [description]
 *
 * @return {boolean} [description]
 */
var TriangleToCircle = function (triangle, circle)
{
    //  First the cheapest ones:

    if (
        triangle.left > circle.right ||
        triangle.right < circle.left ||
        triangle.top > circle.bottom ||
        triangle.bottom < circle.top)
    {
        return false;
    }

    if (Contains(triangle, circle.x, circle.y))
    {
        return true;
    }

    if (LineToCircle(triangle.getLineA(), circle))
    {
        return true;
    }

    if (LineToCircle(triangle.getLineB(), circle))
    {
        return true;
    }

    if (LineToCircle(triangle.getLineC(), circle))
    {
        return true;
    }

    return false;
};

module.exports = TriangleToCircle;
