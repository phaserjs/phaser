/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Point = require('./Point');
var GetMagnitudeSq = require('./GetMagnitudeSq');

/**
 * [description]
 *
 * @function Phaser.Geom.Point.Project
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Point} pointA - [description]
 * @param {Phaser.Geom.Point} pointB - [description]
 * @param {Phaser.Geom.Point} [out] - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var Project = function (pointA, pointB, out)
{
    if (out === undefined) { out = new Point(); }

    var dot = ((pointA.x * pointB.x) + (pointA.y * pointB.y));
    var amt = dot / GetMagnitudeSq(pointB);

    if (amt !== 0)
    {
        out.x = amt * pointB.x;
        out.y = amt * pointB.y;
    }

    return out;
};

module.exports = Project;
