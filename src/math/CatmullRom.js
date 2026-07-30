/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculates a Catmull-Rom interpolated value from the given control points, using a centripetal
 * alpha of 0.5. The interpolation occurs between `p1` and `p2`, with `p0` and `p3` providing
 * tangent context at each end of the segment. At `t = 0` the result equals `p1`; at `t = 1`
 * the result equals `p2`.
 *
 * This function is used internally by Phaser's spline curve implementations to produce smooth,
 * continuous curves that pass through each control point.
 *
 * @function Phaser.Math.CatmullRom
 * @since 3.0.0
 *
 * @param {number} t - The interpolation factor, typically in the range 0 to 1.
 * @param {number} p0 - The first control point (influences the tangent at `p1`).
 * @param {number} p1 - The second control point (start of the interpolated segment).
 * @param {number} p2 - The third control point (end of the interpolated segment).
 * @param {number} p3 - The fourth control point (influences the tangent at `p2`).
 *
 * @return {number} The interpolated Catmull-Rom value between `p1` and `p2`.
 */
var CatmullRom = function (t, p0, p1, p2, p3)
{
    var v0 = (p2 - p0) * 0.5;
    var v1 = (p3 - p1) * 0.5;
    var t2 = t * t;
    var t3 = t * t2;

    return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
};

module.exports = CatmullRom;
