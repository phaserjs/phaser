/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

function P0 (t, p)
{
    var k = 1 - t;

    return k * k * p;
}

function P1 (t, p)
{
    return 2 * (1 - t) * t * p;
}

function P2 (t, p)
{
    return t * t * p;
}

//  p0 = start point
//  p1 = control point 1
//  p2 = end point

// https://github.com/mrdoob/three.js/blob/master/src/extras/core/Interpolations.js

/**
 * A quadratic bezier interpolation method.
 *
 * @function Phaser.Math.Interpolation.QuadraticBezier
 * @since 3.2.0
 *
 * @param {number} t - The percentage of interpolation, between 0 and 1.
 * @param {number} p0 - The start point.
 * @param {number} p1 - The control point.
 * @param {number} p2 - The end point.
 *
 * @return {number} The interpolated value.
 */
var QuadraticBezierInterpolation = function (t, p0, p1, p2)
{
    return P0(t, p0) + P1(t, p1) + P2(t, p2);
};

module.exports = QuadraticBezierInterpolation;
