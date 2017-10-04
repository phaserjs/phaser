/**
 * [description]
 *
 * @function Phaser.Actions.SetScale
 * @since 3.0.0
 * 
 * @param {array} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {number} x - [description]
 * @param {number} y - [description]
 * @param {number} [stepX=0] - [description]
 * @param {number} [stepY=0] - [description]
 * @return {array} The array of Game Objects that was passed to this Action.
 */
var SetScale = function (items, x, y, stepX, stepY)
{
    if (stepX === undefined) { stepX = 0; }
    if (stepY === undefined) { stepY = 0; }

    for (var i = 0; i < items.length; i++)
    {
        items[i].setScale(
            x + (i * stepX),
            y + (i * stepY)
        );
    }

    return items;
};

module.exports = SetScale;
