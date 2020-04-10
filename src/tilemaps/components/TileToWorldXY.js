/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../../const.js');
var Vector2 = require('../../math/Vector2');

/**
 * Converts from tile XY coordinates (tile units) to world XY coordinates (pixels), factoring in the
 * layer's position, scale and scroll. This will return a new Vector2 object or update the given
 * `point` object.
 *
 * @function Phaser.Tilemaps.Components.OrthoTileToWorldXY
 * @private
 * @since 3.0.0
 *
 * @param {integer} tileX - The x coordinate, in tiles, not pixels.
 * @param {integer} tileY - The y coordinate, in tiles, not pixels.
 * @param {Phaser.Math.Vector2} [point] - A Vector2 to store the coordinates in. If not given a new Vector2 is created.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Math.Vector2} The XY location in world coordinates.
 */
var OrthoTileToWorldXY = function (tileX, tileY, point, camera, layer)
{
    if (point === undefined) { point = new Vector2(0, 0); }
    
    var tileHeight = layer.baseTileHeight;
    var tileWidth = layer.baseTileWidth;
    var tilemapLayer = layer.tilemapLayer;
    var layerWorldX = 0;
    var layerWorldY = 0;

    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }

        layerWorldX = tilemapLayer.x + camera.scrollX * (1 - tilemapLayer.scrollFactorX);

        tileWidth *= tilemapLayer.scaleX;

        layerWorldY = (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));
        
        tileHeight *= tilemapLayer.scaleY;
    }

    point.x = layerWorldX + tileX * tileWidth;
    point.y = layerWorldY + tileY * tileHeight;


    
    return point;
};

/**
 * Converts from isometric tile XY coordinates (tile units) to world XY coordinates (pixels), factoring in the
 * layer's position, scale and scroll. This will return a new Vector2 object or update the given
 * `point` object.
 *
 * @function Phaser.Tilemaps.Components.IsoTileToWorldXY
 * @private
 * @since 3.2.2
 *
 * @param {integer} tileX - The x coordinate, in tiles, not pixels.
 * @param {integer} tileY - The y coordinate, in tiles, not pixels.
 * @param {Phaser.Math.Vector2} [point] - A Vector2 to store the coordinates in. If not given a new Vector2 is created.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Math.Vector2} The XY location in world coordinates.
 */
var IsoTileToWorldXY = function (tileX, tileY, point, camera, layer)
{
    var tileWidth = layer.baseTileWidth;
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;

    if (point === undefined) { point = new Vector2(0, 0); }

    var layerWorldX = 0;
    var layerWorldY = 0;

    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }
        layerWorldX = tilemapLayer.x + camera.scrollX * (1 - tilemapLayer.scrollFactorX);
        tileWidth *= tilemapLayer.scaleX;
        layerWorldY = (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));
        tileHeight *= tilemapLayer.scaleY;
    }


    point.x = layerWorldX + (tileX - tileY) * (tileWidth / 2);
    point.y = layerWorldY + (tileX + tileY) * (tileHeight / 2);

    
    return point;
};

/**
 * Converts from staggered tile XY coordinates (tile units) to world XY coordinates (pixels), factoring in the
 * layer's position, scale and scroll. This will return a new Vector2 object or update the given
 * `point` object.
 *
 * @function Phaser.Tilemaps.Components.StagTileToWorldXY
 * @private
 * @since 3.2.2
 *
 * @param {integer} tileX - The x coordinate, in tiles, not pixels.
 * @param {integer} tileY - The y coordinate, in tiles, not pixels.
 * @param {Phaser.Math.Vector2} [point] - A Vector2 to store the coordinates in. If not given a new Vector2 is created.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Math.Vector2} The XY location in world coordinates.
 */
var StagTileToWorldXY = function (tileX, tileY, point, camera, layer)
{
    var tileWidth = layer.baseTileWidth;
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;

    if (point === undefined) { point = new Vector2(0, 0); }

    var layerWorldX = 0;
    var layerWorldY = 0;

    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }
        layerWorldX = tilemapLayer.x + camera.scrollX * (1 - tilemapLayer.scrollFactorX);
        tileWidth *= tilemapLayer.scaleX;
        layerWorldY = (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));
        tileHeight *= tilemapLayer.scaleY;
    }


    point.x = layerWorldX + tileX * tileWidth + tileY % 2 * (tileWidth / 2);
    point.y = layerWorldY + tileY * (tileHeight / 2);
    
    return point;
};

/**
 * Converts from hexagonal tile XY coordinates (tile units) to world XY coordinates (pixels), factoring in the
 * layer's position, scale and scroll. This will return a new Vector2 object or update the given
 * `point` object.
 *
 * @function Phaser.Tilemaps.Components.HexTileToWorldXY
 * @private
 * @since 3.2.2
 *
 * @param {integer} tileX - The x coordinate, in tiles, not pixels.
 * @param {integer} tileY - The y coordinate, in tiles, not pixels.
 * @param {Phaser.Math.Vector2} [point] - A Vector2 to store the coordinates in. If not given a new Vector2 is created.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Math.Vector2} The XY location in world coordinates.
 */
var HexTileToWorldXY = function (tileX, tileY, point, camera, layer)
{
    var tileWidth = layer.baseTileWidth;
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;

    if (point === undefined) { point = new Vector2(0, 0); }
    var layerWorldX = 0;
    var layerWorldY = 0;

    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }
        layerWorldX = tilemapLayer.x + camera.scrollX * (1 - tilemapLayer.scrollFactorX);
        tileWidth *= tilemapLayer.scaleX;
        layerWorldY = (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));
        tileHeight *= tilemapLayer.scaleY;
    }

    var sidel = layer.hexSideLength;
    var rowHeight = ((tileHeight - sidel) / 2 + sidel);

    // similar to staggered, because Tiled uses the oddr representation.
    point.x = layerWorldX + tileX * tileWidth + tileY % 2 * (tileWidth / 2);
    point.y = layerWorldY + tileY * rowHeight;
    
    return point;
};

var TileToWorldXY = function (orientation)
{
    switch (orientation)
    {
        case CONST.STAGGERED:
            return StagTileToWorldXY;
        case CONST.ISOMETRIC:
            return IsoTileToWorldXY;
        case CONST.HEXAGONAL:
            return HexTileToWorldXY;
        default:
            return OrthoTileToWorldXY;
    }

};

module.exports = TileToWorldXY;
