/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Polygon = require('./Polygon');

/**
 * [description]
 *
 * @function Phaser.Geom.Polygon.Clone
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Polygon} polygon - [description]
 *
 * @return {Phaser.Geom.Polygon} [description]
 */
var Clone = function (polygon)
{
    return new Polygon(polygon.points);
};

module.exports = Clone;
