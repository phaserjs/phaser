/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BresenhamPoints = require('../geom/line/BresenhamPoints');

/**
 * Takes an array of Game Objects and positions them on evenly spaced points around the edges of a Triangle.
 * 
 * If you wish to pass a `Phaser.GameObjects.Triangle` Shape to this function, you should pass its `geom` property.
 *
 * @function Phaser.Actions.PlaceOnTriangle
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to position the Game Objects on.
 * @param {number} [stepRate=1] - An optional step rate, to increase or decrease the packing of the Game Objects on the lines.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var PlaceOnTriangle = function (items, triangle, stepRate)
{
    var p1 = BresenhamPoints({ x1: triangle.x1, y1: triangle.y1, x2: triangle.x2, y2: triangle.y2 }, stepRate);
    var p2 = BresenhamPoints({ x1: triangle.x2, y1: triangle.y2, x2: triangle.x3, y2: triangle.y3 }, stepRate);
    var p3 = BresenhamPoints({ x1: triangle.x3, y1: triangle.y3, x2: triangle.x1, y2: triangle.y1 }, stepRate);

    //  Remove overlaps
    p1.pop();
    p2.pop();
    p3.pop();

    p1 = p1.concat(p2, p3);

    var step = p1.length / items.length;
    var p = 0;

    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];
        var point = p1[Math.floor(p)];

        item.x = point.x;
        item.y = point.y;

        p += step;
    }

    return items;
};

module.exports = PlaceOnTriangle;
