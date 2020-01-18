/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Geom = require('../../geom/');
var GetTilesWithin = require('./GetTilesWithin');
var Intersects = require('../../geom/intersects/');
var NOOP = require('../../utils/NOOP');
var TileToWorldX = require('./TileToWorldX');
var TileToWorldY = require('./TileToWorldY');
var WorldToTileX = require('./WorldToTileX');
var WorldToTileY = require('./WorldToTileY');

var TriangleToRectangle = function (triangle, rect)
{
    return Intersects.RectangleToTriangle(rect, triangle);
};

// Note: Could possibly be optimized by copying the shape and shifting it into tilemapLayer
// coordinates instead of shifting the tiles.

/**
 * Gets the tiles that overlap with the given shape in the given layer. The shape must be a Circle,
 * Line, Rectangle or Triangle. The shape should be in world coordinates.
 *
 * @function Phaser.Tilemaps.Components.GetTilesWithinShape
 * @private
 * @since 3.0.0
 *
 * @param {(Phaser.Geom.Circle|Phaser.Geom.Line|Phaser.Geom.Rectangle|Phaser.Geom.Triangle)} shape - A shape in world (pixel) coordinates
 * @param {object} [filteringOptions] - Optional filters to apply when getting the tiles.
 * @param {boolean} [filteringOptions.isNotEmpty=false] - If true, only return tiles that don't have -1 for an index.
 * @param {boolean} [filteringOptions.isColliding=false] - If true, only return tiles that collide on at least one side.
 * @param {boolean} [filteringOptions.hasInterestingFace=false] - If true, only return tiles that have at least one interesting face.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Tilemaps.Tile[]} Array of Tile objects.
 */
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
