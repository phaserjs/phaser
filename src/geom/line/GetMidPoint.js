/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Point = require('../point/Point');

/**
 * [description]
 *
 * @function Phaser.Geom.Line.GetMidPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - [description]
 * @param {(Phaser.Geom.Point|object)} [out] - [description]
 *
 * @return {(Phaser.Geom.Point|object)} [description]
 */
var GetMidPoint = function (line, out)
{
    if (out === undefined) { out = new Point(); }

    out.x = (line.x1 + line.x2) / 2;
    out.y = (line.y1 + line.y2) / 2;

    return out;
};

module.exports = GetMidPoint;
