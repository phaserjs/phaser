// Centers this Rectangle so that the center coordinates match the given x and y values.

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.CenterOn
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 * @param {number} x - [description]
 * @param {number} y - [description]
 *
 * @return {Phaser.Geom.Rectangle} [description]
 */
var CenterOn = function (rect, x, y)
{
    rect.x = x - (rect.width / 2);
    rect.y = y - (rect.height / 2);

    return rect;
};

module.exports = CenterOn;
