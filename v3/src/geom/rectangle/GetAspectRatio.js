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
