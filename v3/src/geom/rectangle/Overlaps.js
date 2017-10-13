/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.Overlaps
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rectA - [description]
 * @param {Phaser.Geom.Rectangle} rectB - [description]
 *
 * @return {boolean} [description]
 */
var Overlaps = function (rectA, rectB)
{
    return (
        rectA.x < rectB.right && 
        rectA.right > rectB.x && 
        rectA.y < rectB.bottom && 
        rectA.bottom > rectB.y
    );
};

module.exports = Overlaps;
