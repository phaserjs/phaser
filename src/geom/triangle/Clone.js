/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Triangle = require('./Triangle');

/**
 * [description]
 *
 * @function Phaser.Geom.Triangle.Clone
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} source - [description]
 *
 * @return {Phaser.Geom.Triangle} [description]
 */
var Clone = function (source)
{
    return new Triangle(source.x1, source.y1, source.x2, source.y2, source.x3, source.y3);
};

module.exports = Clone;
