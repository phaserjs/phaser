/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Point = require('../point/Point');

//  Get a point on the given line 'progress' percentage along its length.
//  progress is a value between 0 and 1.

/**
 * [description]
 *
 * @function Phaser.Geom.Line.GetPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - [description]
 * @param {float} position - A value between 0 and 1, where 0 equals 0 degrees, 0.5 equals 180 degrees and 1 equals 360 around the circle.
 * @param {(Phaser.Geom.Point|object)} [out] - [description]
 *
 * @return {(Phaser.Geom.Point|object)} [description]
 */
var GetPoint = function (line, position, out)
{
    if (out === undefined) { out = new Point(); }

    out.x = line.x1 + (line.x2 - line.x1) * position;
    out.y = line.y1 + (line.y2 - line.y1) * position;

    return out;
};

module.exports = GetPoint;
