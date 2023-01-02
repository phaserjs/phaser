/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes an array of Game Objects and positions them on evenly spaced points around the perimeter of a Circle.
 *
 * If you wish to pass a `Phaser.GameObjects.Circle` Shape to this function, you should pass its `geom` property.
 *
 * @function Phaser.Actions.PlaceOnCircle
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Circle} circle - The Circle to position the Game Objects on.
 * @param {number} [startAngle=0] - Optional angle to start position from, in radians.
 * @param {number} [endAngle=6.28] - Optional angle to stop position at, in radians.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var PlaceOnCircle = function (items, circle, startAngle, endAngle)
{
    if (startAngle === undefined) { startAngle = 0; }
    if (endAngle === undefined) { endAngle = 6.28; }

    var angle = startAngle;
    var angleStep = (endAngle - startAngle) / items.length;

    var cx = circle.x;
    var cy = circle.y;
    var radius = circle.radius;

    for (var i = 0; i < items.length; i++)
    {
        items[i].x = cx + (radius * Math.cos(angle));
        items[i].y = cy + (radius * Math.sin(angle));

        angle += angleStep;
    }

    return items;
};

module.exports = PlaceOnCircle;
