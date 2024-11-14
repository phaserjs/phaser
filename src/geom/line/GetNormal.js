/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
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
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to calculate the normal of.
 * @param {(Phaser.Math.Vector2|object)} [out] - An optional point object to store the normal in.
 *
 * @return {(Phaser.Math.Vector2|object)} The normal of the Line.
 */
var GetNormal = function (line, out)
{
    if (out === undefined) { out = new Point(); }

    var a = Angle(line) - MATH_CONST.PI_OVER_2;

    out.x = Math.cos(a);
    out.y = Math.sin(a);

    return out;
};

module.exports = GetNormal;
