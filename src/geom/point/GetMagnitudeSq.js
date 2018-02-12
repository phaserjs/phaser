/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Geom.Point.GetMagnitudeSq
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} point - [description]
 *
 * @return {number} [description]
 */
var GetMagnitudeSq = function (point)
{
    return (point.x * point.x) + (point.y * point.y);
};

module.exports = GetMagnitudeSq;
