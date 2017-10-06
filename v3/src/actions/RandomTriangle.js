var Random = require('../geom/triangle/Random');

/**
 * [description]
 *
 * @function Phaser.Actions.RandomTriangle
 * @since 3.0.0
 * 
 * @param {array} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Triangle} triangle - [description]
 *
 * @return {array} The array of Game Objects that was passed to this Action.
 */
var RandomTriangle = function (items, triangle)
{
    for (var i = 0; i < items.length; i++)
    {
        Random(triangle, items[i]);
    }

    return items;
};

module.exports = RandomTriangle;
