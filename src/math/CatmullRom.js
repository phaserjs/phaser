/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculates a Catmull-Rom value from the given points, based on an alpha of 0.5.
 *
 * @function Phaser.Math.CatmullRom
 * @since 3.0.0
 *
 * @param {number} t - The amount to interpolate by.
 * @param {number} p0 - The first control point.
 * @param {number} p1 - The second control point.
 * @param {number} p2 - The third control point.
 * @param {number} p3 - The fourth control point.
 *
 * @return {number} The Catmull-Rom value.
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
