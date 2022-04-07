/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MATH_CONST = require('../../math/const');
var Angle = require('./Angle');
var Point = require('../point/Point');

/**
 * Calculate the normal of the given line.
 *
 * The normal of a line is a vector that points perpendicular from it.
 *
 * @function Phaser.Geom.Line.GetNormal
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to calculate the normal of.
 * @param {(Phaser.Geom.Point|object)} [out] - An optional point object to store the normal in.
 *
 * @return {(Phaser.Geom.Point|object)} The normal of the Line.
 */
var GetNormal = function (line, out)
{
    if (out === undefined) { out = new Point(); }

    var a = Angle(line) - MATH_CONST.TAU;

    out.x = Math.cos(a);
    out.y = Math.sin(a);

    return out;
};

module.exports = GetNormal;
