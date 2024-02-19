/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Point = require('../point/Point');

/**
 * Returns a random point on a given Line.
 *
 * @function Phaser.Geom.Line.Random
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The Line to calculate the random Point on.
 * @param {(Phaser.Geom.Point|object)} [out] - An instance of a Point to be modified.
 *
 * @return {(Phaser.Geom.Point|object)} A random Point on the Line.
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
