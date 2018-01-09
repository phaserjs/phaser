var Random = require('../geom/circle/Random');

/**
 * [description]
 *
 * @function Phaser.Actions.RandomCircle
 * @since 3.0.0
 * 
 * @param {array} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Circle} circle - [description]
 *
 * @return {array} The array of Game Objects that was passed to this Action.
 */
var RandomCircle = function (items, circle)
{
    for (var i = 0; i < items.length; i++)
    {
        Random(circle, items[i]);
    }

    return items;
};

module.exports = RandomCircle;
