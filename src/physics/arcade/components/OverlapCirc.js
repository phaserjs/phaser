var OverlapRect = require('./OverlapRect');
var Circle = require('../../../geom/circle/Circle');
var CircleToCircle = require('../../../geom/intersects/CircleToCircle');
var CircleToRectangle = require('../../../geom/intersects/CircleToRectangle');

/**
 * This method will search the given circular area and return an array of all physics bodies that
 * overlap with it. It can return either Dynamic, Static bodies or a mixture of both.
 *
 * A body only has to intersect with the search area to be considered, it doesn't have to be fully
 * contained within it.
 *
 * If Arcade Physics is set to use the RTree (which it is by default) then the search is rather fast,
 * otherwise the search is O(N) for Dynamic Bodies.
 *
 * @function Phaser.Physics.Arcade.Components.OverlapCirc
 * @since 3.21.0
 *
 * @param {number} x - The x coordinate of the center of the area to search within.
 * @param {number} y - The y coordinate of the center of the area to search within.
 * @param {number} radius - The radius of the area to search within.
 * @param {boolean} [includeDynamic=true] - Should the search include Dynamic Bodies?
 * @param {boolean} [includeStatic=false] - Should the search include Static Bodies?
 *
 * @return {(Phaser.Physics.Arcade.Body[]|Phaser.Physics.Arcade.StaticBody[])} An array of bodies that overlap with the given area.
 */
var OverlapCirc = function (world, x, y, radius, includeDynamic, includeStatic)
{
    var bodiesInRect = OverlapRect(world, x - radius, y - radius, 2 * radius, 2 * radius, includeDynamic, includeStatic);

    if (bodiesInRect.length === 0)
    {
        return bodiesInRect;
    }

    var area = new Circle(x, y, radius);
    var circFromBody = new Circle();
    var bodiesInArea = [];

    for (var i = 0; i < bodiesInRect.length; i++)
    {
        var body = bodiesInRect[i];

        if (body.isCircle)
        {
            circFromBody.setTo(body.center.x, body.center.y, body.halfWidth);

            if (CircleToCircle(area, circFromBody))
            {
                bodiesInArea.push(body);
            }
        }
        else if (CircleToRectangle(area, body))
        {
            bodiesInArea.push(body);
        }
    }

    return bodiesInArea;
};

module.exports = OverlapCirc;
