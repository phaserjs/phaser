/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Point = require('../point/Point');

/**
 * [description]
 *
 * @function Phaser.Geom.Line.Random
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - [description]
 * @param {Phaser.Geom.Point|object} [out] - [description]
 *
 * @return {Phaser.Geom.Point|object} [description]
 */
var Random = function (line, out)
{
    if (out === undefined) { out = new Point(); }

    var t = Math.random();

    out.x = line.x1 + t * (line.x2 - line.x1);
    out.y = line.y1 + t * (line.y2 - line.y1);

    return out;
};

module.exports = Random;
