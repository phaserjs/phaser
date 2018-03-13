/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Rectangle = require('../rectangle/Rectangle');

/**
 * [description]
 *
 * @function Phaser.Geom.Polygon.GetAABB
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Polygon} polygon - [description]
 * @param {Phaser.Geom.Rectangle|object} [out] - [description]
 *
 * @return {Phaser.Geom.Rectangle|object} [description]
 */
var GetAABB = function (polygon, out)
{
    if (out === undefined) { out = new Rectangle(); }

    var minX = Infinity;
    var minY = Infinity;
    var maxX = -minX;
    var maxY = -minY;
    var p;

    for (var i = 0; i < polygon.points.length; i++)
    {
        p = polygon.points[i];

        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
    }

    out.x = minX;
    out.y = minY;
    out.width = maxX - minX;
    out.height = maxY - minY;

    return out;
};

module.exports = GetAABB;
