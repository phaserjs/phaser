/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Math.Angle.BetweenPoints
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point|object} point1 - [description]
 * @param {Phaser.Geom.Point|object} point2 - [description]
 *
 * @return {number} [description]
 */
var BetweenPoints = function (point1, point2)
{
    return Math.atan2(point2.y - point1.y, point2.x - point1.x);
};

module.exports = BetweenPoints;
