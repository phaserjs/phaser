/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Line = require('./Line');

/**
 * [description]
 *
 * @function Phaser.Geom.Line.Clone
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} source - [description]
 *
 * @return {Phaser.Geom.Line} [description]
 */
var Clone = function (source)
{
    return new Line(source.x1, source.y1, source.x2, source.y2);
};

module.exports = Clone;
