/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Polygon = require('./Polygon');

/**
 * Create a new polygon which is a copy of the specified polygon
 *
 * @function Phaser.Geom.Polygon.Clone
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Polygon} polygon - The polygon to create a clone of
 *
 * @return {Phaser.Geom.Polygon} A new separate Polygon cloned from the specified polygon, based on the same points.
 */
var Clone = function (polygon)
{
    return new Polygon(polygon.points);
};

module.exports = Clone;
