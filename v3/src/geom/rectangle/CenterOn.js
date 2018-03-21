/**
* Centers this Rectangle so that the center coordinates match the given x and y values.
*
* @method Phaser.Rectangle#centerOn
* @param {number} x - The x coordinate to place the center of the Rectangle at.
* @param {number} y - The y coordinate to place the center of the Rectangle at.
* @return {Phaser.Rectangle} This Rectangle object
*/
var CenterOn = function (rect, x, y)
{
    rect.x = x - (rect.width / 2);
    rect.y = y - (rect.height / 2);

    return rect;
};

module.exports = CenterOn;
