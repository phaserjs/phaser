/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var RotateAroundDistance = require('../math/RotateAroundDistance');
var DistanceBetween = require('../math/distance/DistanceBetween');

/**
 * Rotates each item around the given point by the given angle.
 *
 * @function Phaser.Actions.RotateAround
 * @since 3.0.0
 * @see Phaser.Math.RotateAroundDistance
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {object} point - Any object with public `x` and `y` properties.
 * @param {number} angle - The angle to rotate by, in radians.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var RotateAround = function (items, point, angle)
{
    var x = point.x;
    var y = point.y;

    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];

        RotateAroundDistance(item, x, y, angle, Math.max(1, DistanceBetween(item.x, item.y, x, y)));
    }

    return items;
};

module.exports = RotateAround;
