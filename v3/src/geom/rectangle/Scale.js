/**
* Scales the width and height of this Rectangle by the given amounts.
* 
* @method Phaser.Rectangle#scale
* @param {number} x - The amount to scale the width of the Rectangle by. A value of 0.5 would reduce by half, a value of 2 would double the width, etc.
* @param {number} [y] - The amount to scale the height of the Rectangle by. A value of 0.5 would reduce by half, a value of 2 would double the height, etc.
* @return {Phaser.Rectangle} This Rectangle object
*/
var Scale = function (rect, x, y)
{
    if (y === undefined) { y = x; }

    rect.width *= x;
    rect.height *= y;

    return rect;
};

module.exports = Scale;
