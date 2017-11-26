
var GetTilesWithin = require('./GetTilesWithin');
var WorldToTileX = require('./WorldToTileX');
var WorldToTileY = require('./WorldToTileY');
var TileToWorldX = require('./TileToWorldX');
var TileToWorldY = require('./TileToWorldY');
var Geom = require('../../../geom/');
var Intersects = require('../../../geom/intersects/');
var NOOP = require('../../../utils/NOOP');

var TriangleToRectangle = function (triangle, rect)
{
    return Intersects.RectangleToTriangle(rect, triangle);
};

// Circle, Line, Rect, Triangle in world coordinates.
// Notes: circle is not working yet - see CircleToRectangle in geom. Could possibly be optimized
// by copying the shape and shifting it into tilemapLayer coordinates instead of shifting the tiles.
var GetTilesWithinShape = function (shape, filteringOptions, camera, layer)
{
    if (shape === undefined) { return []; }

    // intersectTest is a function with parameters: shape, rect
    var intersectTest = NOOP;
    if (shape instanceof Geom.Circle) { intersectTest = Intersects.CircleToRectangle; }
    else if (shape instanceof Geom.Rectangle) { intersectTest = Intersects.RectangleToRectangle; }
    else if (shape instanceof Geom.Triangle) { intersectTest = TriangleToRectangle; }
    else if (shape instanceof Geom.Line) { intersectTest = Intersects.LineToRectangle; }

    // Top left corner of the shapes's bounding box, rounded down to include partial tiles
    var xStart = WorldToTileX(shape.left, true, camera, layer);
    var yStart = WorldToTileY(shape.top, true, camera, layer);

    // Bottom right corner of the shapes's bounding box, rounded up to include partial tiles
    var xEnd = Math.ceil(WorldToTileX(shape.right, false, camera, layer));
    var yEnd = Math.ceil(WorldToTileY(shape.bottom, false, camera, layer));

    // Tiles within bounding rectangle of shape. Bounds are forced to be at least 1 x 1 tile in size
    // to grab tiles for shapes that don't have a height or width (e.g. a horizontal line).
    var width = Math.max(xEnd - xStart, 1);
    var height = Math.max(yEnd - yStart, 1);
    var tiles = GetTilesWithin(xStart, yStart, width, height, filteringOptions, layer);

    var tileWidth = layer.tileWidth;
    var tileHeight = layer.tileHeight;
    if (layer.tilemapLayer)
    {
        tileWidth *= layer.tilemapLayer.scaleX;
        tileHeight *= layer.tilemapLayer.scaleY;
    }

    var results = [];
    var tileRect = new Geom.Rectangle(0, 0, tileWidth, tileHeight);
    for (var i = 0; i < tiles.length; i++)
    {
        var tile = tiles[i];
        tileRect.x = TileToWorldX(tile.x, camera, layer);
        tileRect.y = TileToWorldY(tile.y, camera, layer);
        if (intersectTest(shape, tileRect))
        {
            results.push(tile);
        }
    }

    return results;
};

module.exports = GetTilesWithinShape;
