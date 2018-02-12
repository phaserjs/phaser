/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.GetAspectRatio
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 *
 * @return {number} [description]
 */
var GetAspectRatio = function (rect)
{
    return (rect.height === 0) ? NaN : rect.width / rect.height;
};

module.exports = GetAspectRatio;
