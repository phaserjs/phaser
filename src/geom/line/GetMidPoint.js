/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Point = require('../point/Point');

/**
 * Get the midpoint of the given line.
 *
 * @function Phaser.Geom.Line.GetMidPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to get the midpoint of.
 * @param {(Phaser.Geom.Point|object)} [out] - An optional point object to store the midpoint in.
 *
 * @return {(Phaser.Geom.Point|object)} The midpoint of the Line.
 */
var GetMidPoint = function (line, out)
{
    if (out === undefined) { out = new Point(); }

    out.x = (line.x1 + line.x2) / 2;
    out.y = (line.y1 + line.y2) / 2;

    return out;
};

module.exports = GetMidPoint;
