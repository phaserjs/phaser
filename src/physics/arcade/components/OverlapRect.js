/**
 * This method will search the given rectangular area and return an array of all physics bodies that
 * overlap with it. It can return either Dynamic, Static bodies or a mixture of both.
 * 
 * A body only has to intersect with the search area to be considered, it doesn't have to be fully
 * contained within it.
 * 
 * If Arcade Physics is set to use the RTree (which it is by default) then the search for is extremely fast,
 * otherwise the search is O(N) for Dynamic Bodies.
 *
 * @function Phaser.Physics.Arcade.Components.OverlapRect
 * @since 3.17.0
 *
 * @param {number} x - The top-left x coordinate of the area to search within.
 * @param {number} y - The top-left y coordinate of the area to search within.
 * @param {number} width - The width of the area to search within.
 * @param {number} height - The height of the area to search within.
 * @param {boolean} [includeDynamic=true] - Should the search include Dynamic Bodies?
 * @param {boolean} [includeStatic=false] - Should the search include Static Bodies?
 *
 * @return {(Phaser.Physics.Arcade.Body[]|Phaser.Physics.Arcade.StaticBody[])} An array of bodies that overlap with the given area.
 */
var OverlapRect = function (world, x, y, width, height, includeDynamic, includeStatic)
{
    if (includeDynamic === undefined) { includeDynamic = true; }
    if (includeStatic === undefined) { includeStatic = false; }

    var dynamicBodies = [];
    var staticBodies = [];

    var minMax = world.treeMinMax;

    minMax.minX = x;
    minMax.minY = y;
    minMax.maxX = x + width;
    minMax.maxY = y + height;

    if (includeStatic)
    {
        staticBodies = world.staticTree.search(minMax);
    }

    if (includeDynamic && world.useTree)
    {
        dynamicBodies = world.tree.search(minMax);
    }
    else if (includeDynamic)
    {
        var bodies = world.bodies;

        var fakeBody =
        {
            position: {
                x: x,
                y: y
            },
            left: x,
            top: y,
            right: x + width,
            bottom: y + height,
            isCircle: false
        };

        var intersects = world.intersects;

        bodies.iterate(function (target)
        {
            if (intersects(target, fakeBody))
            {
                dynamicBodies.push(target);
            }

        });
    }

    return staticBodies.concat(dynamicBodies);
};

module.exports = OverlapRect;
