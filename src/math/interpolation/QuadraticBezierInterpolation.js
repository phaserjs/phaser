/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
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
 * [description]
 *
 * @function Phaser.Math.Interpolation.QuadraticBezier
 * @since 3.2.0
 *
 * @param {float} t - [description]
 * @param {number} p0 - [description]
 * @param {number} p1 - [description]
 * @param {number} p2 - [description]
 *
 * @return {number} [description]
 */
var QuadraticBezierInterpolation = function (t, p0, p1, p2)
{
    return P0(t, p0) + P1(t, p1) + P2(t, p2);
};

module.exports = QuadraticBezierInterpolation;
