/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MathRotateAroundDistance = require('../math/RotateAroundDistance');

/**
 * Rotates each Game Object in the given array around a point by the specified angle, positioning each item at the given distance from that point. If the distance is zero, the items are not moved.
 *
 * @function Phaser.Actions.RotateAroundDistance
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {object} point - Any object with public `x` and `y` properties.
 * @param {number} angle - The angle to rotate by, in radians.
 * @param {number} distance - The distance from the point of rotation in pixels.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var RotateAroundDistance = function (items, point, angle, distance)
{
    var x = point.x;
    var y = point.y;

    //  There's nothing to do
    if (distance === 0)
    {
        return items;
    }

    for (var i = 0; i < items.length; i++)
    {
        MathRotateAroundDistance(items[i], x, y, angle, distance);
    }

    return items;
};

module.exports = RotateAroundDistance;
