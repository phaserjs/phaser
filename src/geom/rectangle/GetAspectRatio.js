/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculates the width/height ratio of a rectangle.
 *
 * @function Phaser.Geom.Rectangle.GetAspectRatio
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - The rectangle.
 *
 * @return {number} The width/height ratio of the rectangle.
 */
var GetAspectRatio = function (rect)
{
    return (rect.height === 0) ? NaN : rect.width / rect.height;
};

module.exports = GetAspectRatio;
