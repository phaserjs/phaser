/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Geom = require('../../geom/');
var GetTilesWithin = require('./GetTilesWithin');
var IsometricWorldToTileXY = require('./IsometricWorldToTileXY');
var Intersects = require('../../geom/intersects/');
var NOOP = require('../../utils/NOOP');
var Vector2 = require('../../math/Vector2');
var CONST = require('../const/ORIENTATION_CONST');

var TriangleToRectangle = function (triangle, rect)
{
    return Intersects.RectangleToTriangle(rect, triangle);
};

var CircleToTriangle = function (circle, triangle)
{
    return Intersects.TriangleToCircle(triangle, circle);
};

var LineToTriangle = function (line, triangle)
{
    return Intersects.TriangleToLine(triangle, line);
};

var point = new Vector2();
var pointStart = new Vector2();
var pointEnd = new Vector2();

/**
 * Gets the tiles that overlap with the given shape in the given layer. The shape must be a Circle,
 * Line, Rectangle or Triangle. The shape should be in world coordinates.
 * 
 * **Note:** This method only works with orthogonal and isometric tilemap layers.
 * On isometric layers a tile is tested using its diamond, not its bounding box.
 *
 * @function Phaser.Tilemaps.Components.GetTilesWithinShape
 * @since 3.0.0
 *
 * @param {(Phaser.Geom.Circle|Phaser.Geom.Line|Phaser.Geom.Rectangle|Phaser.Geom.Triangle)} shape - A shape in world (pixel) coordinates
 * @param {Phaser.Types.Tilemaps.FilteringOptions} filteringOptions - Optional filters to apply when getting the tiles.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects that intersect with the given shape, or an empty array if no tiles overlap or the layer is not orthogonal or isometric.
 */
var GetTilesWithinShape = function (shape, filteringOptions, camera, layer)
{
    if (layer.orientation === CONST.ISOMETRIC)
    {
        return GetIsometricTilesWithinShape(shape, filteringOptions, camera, layer);
    }

    if (layer.orientation !== CONST.ORTHOGONAL)
    {
        console.warn('GetTilesWithinShape only works with orthogonal and isometric tilemaps');
        return [];
    }

    if (shape === undefined) { return []; }

    // intersectTest is a function with parameters: shape, rect
    var intersectTest = NOOP;

    if (shape instanceof Geom.Circle)
    {
        intersectTest = Intersects.CircleToRectangle;
    }
    else if (shape instanceof Geom.Rectangle)
    {
        intersectTest = Intersects.RectangleToRectangle;
    }
    else if (shape instanceof Geom.Triangle)
    {
        intersectTest = TriangleToRectangle;
    }
    else if (shape instanceof Geom.Line)
    {
        intersectTest = Intersects.LineToRectangle;
    }

    // Top left corner of the shapes's bounding box, rounded down to include partial tiles
    layer.tilemapLayer.worldToTileXY(shape.left, shape.top, true, pointStart, camera);

    var xStart = pointStart.x;
    var yStart = pointStart.y;

    // Bottom right corner of the shapes's bounding box, rounded up to include partial tiles
    layer.tilemapLayer.worldToTileXY(shape.right, shape.bottom, false, pointEnd, camera);

    var xEnd = Math.ceil(pointEnd.x);
    var yEnd = Math.ceil(pointEnd.y);

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

        layer.tilemapLayer.tileToWorldXY(tile.x, tile.y, point, camera);

        tileRect.x = point.x;
        tileRect.y = point.y;

        if (intersectTest(shape, tileRect))
        {
            results.push(tile);
        }
    }

    return results;
};

var diamondTop = new Geom.Triangle();
var diamondBottom = new Geom.Triangle();

/**
 * The isometric version of GetTilesWithinShape. Each tile is tested as two triangles that make up its diamond.
 *
 * @function Phaser.Tilemaps.Components.GetIsometricTilesWithinShape
 * @private
 * @since 4.3.0
 *
 * @param {(Phaser.Geom.Circle|Phaser.Geom.Line|Phaser.Geom.Rectangle|Phaser.Geom.Triangle)} shape - A shape in world (pixel) coordinates
 * @param {Phaser.Types.Tilemaps.FilteringOptions} filteringOptions - Optional filters to apply when getting the tiles.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects that intersect with the given shape.
 */
var GetIsometricTilesWithinShape = function (shape, filteringOptions, camera, layer)
{
    if (shape === undefined) { return []; }

    // intersectTest is a function with parameters: shape, triangle
    var intersectTest = NOOP;

    if (shape instanceof Geom.Circle)
    {
        intersectTest = CircleToTriangle;
    }
    else if (shape instanceof Geom.Rectangle)
    {
        intersectTest = Intersects.RectangleToTriangle;
    }
    else if (shape instanceof Geom.Triangle)
    {
        intersectTest = Intersects.TriangleToTriangle;
    }
    else if (shape instanceof Geom.Line)
    {
        intersectTest = LineToTriangle;
    }

    //  The bounding box of the shape covers a diamond of tiles, so convert all four corners
    var corners = [ shape.left, shape.top, shape.right, shape.top, shape.left, shape.bottom, shape.right, shape.bottom ];

    var xStart = Infinity;
    var yStart = Infinity;
    var xEnd = -Infinity;
    var yEnd = -Infinity;

    for (var c = 0; c < corners.length; c += 2)
    {
        IsometricWorldToTileXY(corners[c], corners[c + 1], true, point, camera, layer, true);

        xStart = Math.min(xStart, point.x);
        yStart = Math.min(yStart, point.y);
        xEnd = Math.max(xEnd, point.x);
        yEnd = Math.max(yEnd, point.y);
    }

    var tiles = GetTilesWithin(xStart, yStart, xEnd - xStart + 1, yEnd - yStart + 1, filteringOptions, layer);

    var tileWidth = layer.tileWidth;
    var tileHeight = layer.tileHeight;

    if (layer.tilemapLayer)
    {
        tileWidth *= layer.tilemapLayer.scaleX;
        tileHeight *= layer.tilemapLayer.scaleY;
    }

    var halfWidth = tileWidth / 2;
    var halfHeight = tileHeight / 2;

    var results = [];

    for (var i = 0; i < tiles.length; i++)
    {
        var tile = tiles[i];

        layer.tilemapLayer.tileToWorldXY(tile.x, tile.y, point, camera);

        var left = point.x;
        var top = point.y;

        diamondTop.setTo(left + halfWidth, top, left + tileWidth, top + halfHeight, left, top + halfHeight);
        diamondBottom.setTo(left + tileWidth, top + halfHeight, left + halfWidth, top + tileHeight, left, top + halfHeight);

        if (intersectTest(shape, diamondTop) || intersectTest(shape, diamondBottom))
        {
            results.push(tile);
        }
    }

    return results;
};

module.exports = GetTilesWithinShape;
