/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.Perimeter
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 *
 * @return {number} [description]
 */
var Perimeter = function (rect)
{
    return 2 * (rect.width + rect.height);
};

module.exports = Perimeter;
