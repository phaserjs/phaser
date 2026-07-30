/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @ignore
 */
function P0 (t, p)
{
    var k = 1 - t;

    return k * k * k * p;
}

/**
 * @ignore
 */
function P1 (t, p)
{
    var k = 1 - t;

    return 3 * k * k * t * p;
}

/**
 * @ignore
 */
function P2 (t, p)
{
    return 3 * (1 - t) * t * t * p;
}

/**
 * @ignore
 */
function P3 (t, p)
{
    return t * t * t * p;
}

/**
 * Calculates a cubic bezier interpolated value for a given parameter `t`, based on four
 * control points. The curve passes through `p0` at `t=0` and `p3` at `t=1`, while `p1`
 * and `p2` act as pull points that shape the curve between those endpoints without
 * necessarily being on it. This makes cubic bezier interpolation well-suited for smooth,
 * art-directed transitions in animations, camera paths, and procedural movement.
 *
 * https://medium.com/@adrian_cooney/bezier-interpolation-13b68563313a
 *
 * @function Phaser.Math.Interpolation.CubicBezier
 * @since 3.0.0
 *
 * @param {number} t - The percentage of interpolation, between 0 and 1.
 * @param {number} p0 - The start point.
 * @param {number} p1 - The first control point.
 * @param {number} p2 - The second control point.
 * @param {number} p3 - The end point.
 *
 * @return {number} The interpolated value.
 */
var CubicBezierInterpolation = function (t, p0, p1, p2, p3)
{
    return P0(t, p0) + P1(t, p1) + P2(t, p2) + P3(t, p3);
};

module.exports = CubicBezierInterpolation;
