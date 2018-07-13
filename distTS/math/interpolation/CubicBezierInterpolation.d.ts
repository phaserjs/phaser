/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare function P3(t: any, p: any): number;
/**
 * A cubic bezier interpolation method.
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
declare var CubicBezierInterpolation: (t: any, p0: any, p1: any, p2: any, p3: any) => number;
