/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.Contains
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 * @param {number} x - [description]
 * @param {number} y - [description]
 *
 * @return {boolean} [description]
 */
var Contains = function (rect, x, y)
{
    if (rect.width <= 0 || rect.height <= 0)
    {
        return false;
    }

    return (rect.x <= x && rect.x + rect.width >= x && rect.y <= y && rect.y + rect.height >= y);
};

module.exports = Contains;
