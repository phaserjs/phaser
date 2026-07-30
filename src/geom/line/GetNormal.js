/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MATH_CONST = require('../../math/const');
var Angle = require('./Angle');
var Vector2 = require('../../math/Vector2');

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
 * @param {Phaser.Math.Vector2} [out] - An optional Vector2 object to store the normal in.
 *
 * @return {Phaser.Math.Vector2} The normal of the Line.
 */
var GetNormal = function (line, out)
{
    if (out === undefined) { out = new Vector2(); }

    var a = Angle(line) - MATH_CONST.PI_OVER_2;

    out.x = Math.cos(a);
    out.y = Math.sin(a);

    return out;
};

module.exports = GetNormal;
