// Scales the width and height of this Rectangle by the given amounts.

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.Scale
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 * @param {number} x - [description]
 * @param {number} y - [description]
 *
 * @return {Phaser.Geom.Rectangle} [description]
 */
var Scale = function (rect, x, y)
{
    if (y === undefined) { y = x; }

    rect.width *= x;
    rect.height *= y;

    return rect;
};

module.exports = Scale;
