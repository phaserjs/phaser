/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Point = require('./Point');

/**
 * Calculates the vector projection of `pointA` onto the nonzero `pointB`. This is the
 * orthogonal projection of `pointA` onto a straight line paralle to `pointB`.
 *
 * @function Phaser.Geom.Point.ProjectUnit
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Point} pointA - Point A, to be projected onto Point B. Must be a normalized point with a magnitude of 1.
 * @param {Phaser.Geom.Point} pointB - Point B, to have Point A projected upon it.
 * @param {Phaser.Geom.Point} [out] - The Point object to store the position in. If not given, a new Point instance is created.
 *
 * @return {Phaser.Geom.Point} A unit Point object holding the coordinates of the vector projection of `pointA` onto `pointB`.
 */
var ProjectUnit = function (pointA, pointB, out)
{
    if (out === undefined) { out = new Point(); }

    var amt = ((pointA.x * pointB.x) + (pointA.y * pointB.y));

    if (amt !== 0)
    {
        out.x = amt * pointB.x;
        out.y = amt * pointB.y;
    }

    return out;
};

module.exports = ProjectUnit;
