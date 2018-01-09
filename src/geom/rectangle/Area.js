/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.Area
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 *
 * @return {number} [description]
 */
var Area = function (rect)
{
    return rect.width * rect.height;
};

module.exports = Area;
