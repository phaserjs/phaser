/**
 * [description]
 *
 * @function Phaser.Actions.ScaleXY
 * @since 3.0.0
 * 
 * @param {array} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {number} x - [description]
 * @param {number} y - [description]
 * @return {array} The array of Game Objects that was passed to this Action.
 */
var ScaleXY = function (items, x, y)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].scaleX += x;
        items[i].scaleY += y;
    }

    return items;
};

module.exports = ScaleXY;
