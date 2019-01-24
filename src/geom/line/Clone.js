/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Line = require('./Line');

/**
 * Clone the given line.
 *
 * @function Phaser.Geom.Line.Clone
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} source - The source line to clone.
 *
 * @return {Phaser.Geom.Line} The cloned line.
 */
var Clone = function (source)
{
    return new Line(source.x1, source.y1, source.x2, source.y2);
};

module.exports = Clone;
