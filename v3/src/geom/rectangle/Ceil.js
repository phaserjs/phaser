/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.Ceil
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 *
 * @return {Phaser.Geom.Rectangle} [description]
 */
var Ceil = function (rect)
{
    rect.x = Math.ceil(rect.x);
    rect.y = Math.ceil(rect.y);

    return rect;
};

module.exports = Ceil;
