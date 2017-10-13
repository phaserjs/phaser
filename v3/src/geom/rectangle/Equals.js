/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.Equals
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 * @param {Phaser.Geom.Rectangle} toCompare - [description]
 *
 * @return {boolean} [description]
 */
var Equals = function (rect, toCompare)
{
    return (
        rect.x === toCompare.x &&
        rect.y === toCompare.y &&
        rect.width === toCompare.width &&
        rect.height === toCompare.height
    );
};

module.exports = Equals;
