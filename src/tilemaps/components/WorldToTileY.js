/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../../const.js');

/**
 * Converts from world Y coordinates (pixels) to orthogonal tile Y coordinates (tile units), factoring in the
 * layer's position, scale and scroll.
 *
 * @function Phaser.Tilemaps.Components.OrthoWorldToTileY
 * @private
 * @since 3.0.0
 *
 * @param {number} worldY - The y coordinate to be converted, in pixels, not tiles.
 * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the nearest integer.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {number} The Y location in tile units.
 */
var OrthoWorldToTileY = function (worldY, snapToFloor, camera, layer)
{
    
    if (snapToFloor === undefined) { snapToFloor = true; }
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;
    
    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's vertical scroll
        worldY = worldY - (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));

        tileHeight *= tilemapLayer.scaleY;

    }

    return snapToFloor
        ? Math.floor(worldY / tileHeight)
        : worldY / tileHeight;

};

/**
 * Converts from world Y coordinates (pixels) to staggered tile Y coordinates (tile units), factoring in the
 * layer's position, scale and scroll.
 *
 * @function Phaser.Tilemaps.Components.StagWorldToTileY
 * @private
 * @since 3.2.2
 *
 * @param {number} worldY - The y coordinate to be converted, in pixels, not tiles.
 * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the nearest integer.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {number} The Y location in tile units.
 */
var StagWorldToTileY = function (worldY, snapToFloor, camera, layer)
{
    
    if (snapToFloor === undefined) { snapToFloor = true; }
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;
    
    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's vertical scroll
        worldY = worldY - (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));

        tileHeight *= tilemapLayer.scaleY;

    }

    return snapToFloor
        ? Math.floor(worldY / (tileHeight / 2))
        : worldY / (tileHeight / 2);
};

/**
 * Converts from world Y coordinates (pixels) to hexagonal tile Y coordinates (tile units), factoring in the
 * layer's position, scale and scroll.
 *
 * @function Phaser.Tilemaps.Components.HexWorldToTileY
 * @private
 * @since 3.2.2
 *
 * @param {number} worldY - The y coordinate to be converted, in pixels, not tiles.
 * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the nearest integer.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {number} The Y location in tile units.
 */
var HexWorldToTileY = function (worldY, snapToFloor, camera, layer)
{
    
    if (snapToFloor === undefined) { snapToFloor = true; }
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;
    
    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's vertical scroll
        worldY = worldY - (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));

        tileHeight *= tilemapLayer.scaleY;

    }


    var sidel = layer.hexSideLength;
    var rowHeight = ((tileHeight - sidel) / 2 + sidel);
    return snapToFloor
        ? Math.floor(worldY / rowHeight)
        : worldY / rowHeight;
};

var nullFunc = function ()
{
    console.warn('With the current map type you have to use the WorldToTileXY function.');
    return null;
};

var WorldToTileY = function (orientation)
{
    switch (orientation)
    {
        case CONST.ORTHOGONAL:
            return OrthoWorldToTileY;
                
        case CONST.HEXAGONAL:
            return HexWorldToTileY;
                
        case CONST.STAGGERED:
            return StagWorldToTileY;
                
        default:
            return nullFunc;
                
    }

};

module.exports = WorldToTileY;
