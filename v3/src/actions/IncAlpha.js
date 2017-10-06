/**
 * [description]
 *
 * @function Phaser.Actions.IncAlpha
 * @since 3.0.0
 * 
 * @param {array} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {number} value - [description]
 *
 * @return {array} The array of Game Objects that was passed to this Action.
 */
var IncAlpha = function (items, value)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].alpha += value;
    }

    return items;
};

module.exports = IncAlpha;
