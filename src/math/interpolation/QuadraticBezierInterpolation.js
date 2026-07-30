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

    return k * k * p;
}

/**
 * @ignore
 */
function P1 (t, p)
{
    return 2 * (1 - t) * t * p;
}

/**
 * @ignore
 */
function P2 (t, p)
{
    return t * t * p;
}

// https://github.com/mrdoob/three.js/blob/master/src/extras/core/Interpolations.js

/**
 * Calculates a single point along a quadratic Bezier curve defined by a start point, a control
 * point, and an end point. The value of `t` determines how far along the curve the returned
 * value sits: 0 returns the start point value, 1 returns the end point value, and values in
 * between are smoothly interpolated. The control point pulls the curve toward it, shaping the
 * arc between the start and end points without the curve passing through it directly.
 *
 * @function Phaser.Math.Interpolation.QuadraticBezier
 * @since 3.2.0
 *
 * @param {number} t - The interpolation position along the curve, between 0 (start) and 1 (end).
 * @param {number} p0 - The start point value.
 * @param {number} p1 - The control point value, which pulls the curve toward it and determines its arc.
 * @param {number} p2 - The end point value.
 *
 * @return {number} The interpolated value at position `t` along the quadratic Bezier curve.
 */
var QuadraticBezierInterpolation = function (t, p0, p1, p2)
{
    return P0(t, p0) + P1(t, p1) + P2(t, p2);
};

module.exports = QuadraticBezierInterpolation;
