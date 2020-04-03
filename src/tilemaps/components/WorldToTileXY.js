/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../../const.js');
var WorldToTileX = require('./WorldToTileX').func;
var WorldToTileY = require('./WorldToTileY').func;
var Vector2 = require('../../math/Vector2');

/**
 * Converts from world XY coordinates (pixels) to orthogonal tile XY coordinates (tile units), factoring in the
 * layer's position, scale and scroll. This will return a new Vector2 object or update the given
 * `point` object.
 *
 * @function Phaser.Tilemaps.Components.OrthoWorldToTileXY
 * @private
 * @since 3.0.0
 *
 * @param {number} worldX - The x coordinate to be converted, in pixels, not tiles.
 * @param {number} worldY - The y coordinate to be converted, in pixels, not tiles.
 * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the nearest integer.
 * @param {Phaser.Math.Vector2} [point] - A Vector2 to store the coordinates in. If not given a new Vector2 is created.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *  
 * @return {Phaser.Math.Vector2} The XY location in tile units.
 */
var OrthoWorldToTileXY = function (worldX, worldY, snapToFloor, point, camera, layer)
{
    if (point === undefined) { point = new Vector2(0, 0); }

    point.x = WorldToTileX(worldX, snapToFloor, camera, layer);
    point.y = WorldToTileY(worldY, snapToFloor, camera, layer);
    return point;
};

/**
 * Converts from world XY coordinates (pixels) to isometric tile XY coordinates (tile units), factoring in the
 * layer's position, scale and scroll. This will return a new Vector2 object or update the given
 * `point` object.
 *
 * @function Phaser.Tilemaps.Components.IsoWorldToTileXY
 * @private
 * @since 3.0.0
 *
 * @param {number} worldX - The x coordinate to be converted, in pixels, not tiles.
 * @param {number} worldY - The y coordinate to be converted, in pixels, not tiles.
 * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the nearest integer.
 * @param {Phaser.Math.Vector2} [point] - A Vector2 to store the coordinates in. If not given a new Vector2 is created.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *  
 * @return {Phaser.Math.Vector2} The XY location in tile units.
 */
var IsoWorldToTileXY = function (worldX, worldY, snapToFloor, point, camera, layer)
{
    if (point === undefined) { point = new Vector2(0, 0); }
        
    var tileWidth = layer.baseTileWidth;
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;
        
    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's vertical scroll
        // console.log(1,worldY)
        worldY = worldY - (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));

        // console.log(worldY)
        tileHeight *= tilemapLayer.scaleY;

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's horizontal scroll
        worldX = worldX - (tilemapLayer.x + camera.scrollX * (1 - tilemapLayer.scrollFactorX));

        tileWidth *= tilemapLayer.scaleX;
    }
    
    point.x = snapToFloor
        ? Math.floor((worldX / (tileWidth / 2) + worldY / (tileHeight / 2)) / 2)
        : ((worldX / (tileWidth / 2) + worldY / (tileHeight / 2)) / 2);

    point.y = snapToFloor
        ? Math.floor((worldY / (tileHeight / 2) - worldX / (tileWidth / 2)) / 2)
        : ((worldY / (tileHeight / 2) - worldX / (tileWidth / 2)) / 2);

    return point;
};

/**
 * Converts from world XY coordinates (pixels) to hexagonal tile XY coordinates (tile units), factoring in the
 * layer's position, scale and scroll. This will return a new Vector2 object or update the given
 * `point` object.
 *
 * @function Phaser.Tilemaps.Components.HexWorldToTileXY
 * @private
 * @since 3.0.0
 *
 * @param {number} worldX - The x coordinate to be converted, in pixels, not tiles.
 * @param {number} worldY - The y coordinate to be converted, in pixels, not tiles.
 * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the nearest integer.
 * @param {Phaser.Math.Vector2} [point] - A Vector2 to store the coordinates in. If not given a new Vector2 is created.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *  
 * @return {Phaser.Math.Vector2} The XY location in tile units.
 */
var HexWorldToTileXY = function (worldX, worldY, snapToFloor, point, camera, layer)
{
    if (point === undefined) { point = new Vector2(0, 0); }

    var tileWidth = layer.baseTileWidth;
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;
    
    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's vertical scroll
        // console.log(1,worldY)
        worldY = worldY - (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));

        // console.log(worldY)
        tileHeight *= tilemapLayer.scaleY;

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's horizontal scroll
        worldX = worldX - (tilemapLayer.x + camera.scrollX * (1 - tilemapLayer.scrollFactorX));

        tileWidth *= tilemapLayer.scaleX;
    }

    var sidel = layer.hexSideLength;
    var rowHeight = ((tileHeight - sidel) / 2 + sidel);

    // similar to staggered, because Tiled uses the oddr representation.
    point.y = snapToFloor
        ? Math.floor((worldY / rowHeight))
        : (worldY / rowHeight);
    point.x = snapToFloor
        ? Math.floor((worldX - (point.y % 2) * 0.5 * tileWidth) / tileWidth)
        : (worldX - (point.y % 2) * 0.5 * tileWidth) / tileWidth;

    return point;
};

/**
 * Converts from world XY coordinates (pixels) to staggered tile XY coordinates (tile units), factoring in the
 * layer's position, scale and scroll. This will return a new Vector2 object or update the given
 * `point` object.
 *
 * @function Phaser.Tilemaps.Components.StagWorldToTileXY
 * @private
 * @since 3.0.0
 *
 * @param {number} worldX - The x coordinate to be converted, in pixels, not tiles.
 * @param {number} worldY - The y coordinate to be converted, in pixels, not tiles.
 * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the nearest integer.
 * @param {Phaser.Math.Vector2} [point] - A Vector2 to store the coordinates in. If not given a new Vector2 is created.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *  
 * @return {Phaser.Math.Vector2} The XY location in tile units.
 */
var StagWorldToTileXY = function (worldX, worldY, snapToFloor, point, camera, layer)
{
    if (point === undefined) { point = new Vector2(0, 0); }

    var tileWidth = layer.baseTileWidth;
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;
    
    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's vertical scroll
        // console.log(1,worldY)
        worldY = worldY - (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));

        // console.log(worldY)
        tileHeight *= tilemapLayer.scaleY;

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's horizontal scroll
        worldX = worldX - (tilemapLayer.x + camera.scrollX * (1 - tilemapLayer.scrollFactorX));

        tileWidth *= tilemapLayer.scaleX;
        
        point.y = snapToFloor
            ? Math.floor((worldY / (tileHeight / 2)))
            : (worldY / (tileHeight / 2));
        point.x = snapToFloor
            ? Math.floor((worldX + (point.y % 2) * 0.5 * tileWidth) / tileWidth)
            : (worldX + (point.y % 2) * 0.5 * tileWidth) / tileWidth;
        
       
    }

    return point;
};

var WorldToTileXY = function (orientation)
{
    switch (orientation)
    {
        case CONST.STAGGERED:
            return StagWorldToTileXY;
            
        case CONST.ISOMETRIC:
            return IsoWorldToTileXY;
            
        case CONST.HEXAGONAL:
            return HexWorldToTileXY;
            
        default:
            return OrthoWorldToTileXY;
            
    }

};

module.exports = WorldToTileXY;
