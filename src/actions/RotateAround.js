/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var RotateAroundDistance = require('../math/RotateAroundDistance');
var DistanceBetween = require('../math/distance/DistanceBetween');

/**
 * [description]
 *
 * @function Phaser.Actions.RotateAround
 * @since 3.0.0
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {object} point - Any object with public `x` and `y` properties.
 * @param {number} angle - The angle to rotate by, in radians.
 *
 * @return {array} The array of Game Objects that was passed to this Action.
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
