var MathRotateAroundDistance = require('../math/RotateAroundDistance');

/**
 * [description]
 *
 * @function Phaser.Actions.RotateAroundDistance
 * @since 3.0.0
 *
 * @param {array} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {object} point - Any object with public `x` and `y` properties.
 * @param {number} angle - The angle to rotate by, in radians.
 * @param {number} distance - The distance from the point of rotation in pixels.
 * @return {array} The array of Game Objects that was passed to this Action.
 */
var RotateAroundDistance = function (items, point, angle, distance)
{
    var x = point.x;
    var y = point.y;

    for (var i = 0; i < items.length; i++)
    {
        MathRotateAroundDistance(items[i], x, y, angle, distance);
    }

    return items;
};

module.exports = RotateAroundDistance;
