/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */


var CONST = require('../../const.js');

/**
 * Converts from orthogonal tile Y coordinates (tile units) to world Y coordinates (pixels), factoring in the
 * layer's position, scale and scroll.
 *
 * @function Phaser.Tilemaps.Components.TileToWorldY
 * @private
 * @since 3.0.0
 *
 * @param {integer} tileY - The x coordinate, in tiles, not pixels.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * 
 * @return {number}
 */
var OrthoTileToWorldY = function (tileY, camera, layer)
{
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;
    var layerWorldY = 0;

    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }
        layerWorldY = (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));
        tileHeight *= tilemapLayer.scaleY;
    }

    return layerWorldY + tileY * tileHeight;

};



/**
 * Converts from staggered tile Y coordinates (tile units) to world Y coordinates (pixels), factoring in the
 * layer's position, scale and scroll.
 *
 * @function Phaser.Tilemaps.Components.StagTileToWorldY
 * @private
 * @since 3.0.0
 *
 * @param {integer} tileY - The x coordinate, in tiles, not pixels.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * 
 * @return {number}
 */
var StagTileToWorldY = function (tileY, camera, layer)
{
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;
    var layerWorldY = 0;

    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }
        layerWorldY = (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));
        tileHeight *= tilemapLayer.scaleY;
    }


    return layerWorldY + tileY * (tileHeight / 2);

};


/**
 * Converts from hexagonal tile Y coordinates (tile units) to world Y coordinates (pixels), factoring in the
 * layer's position, scale and scroll.
 *
 * @function Phaser.Tilemaps.Components.HexTileToWorldY
 * @private
 * @since 3.0.0
 *
 * @param {integer} tileY - The x coordinate, in tiles, not pixels.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * 
 * @return {number}
 */
var HexTileToWorldY = function (tileY, camera, layer)
{
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;
    var layerWorldY = 0;

    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }
        layerWorldY = (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));
        tileHeight *= tilemapLayer.scaleY;
    }
    var sidel = layer.tilemapLayer.tilemap.hexSideLength;
    var rowHeight = ((tileHeight - sidel) / 2 + sidel);

    // same as staggered
    return layerWorldY + tileY * rowHeight;
};


var nullFunc = function ()
{
    console.warn('With the current map type you have to use the TileToWorldXY function.');
    return null;
};

var TileToWorldY = function (orientation)
{
    switch (orientation)
    {
        case CONST.STAGGERED:
            return StagTileToWorldY;
        case CONST.ISOMETRIC:
            return nullFunc;
        case CONST.HEXAGONAL:
            return HexTileToWorldY;
        default:
            return OrthoTileToWorldY;
                
    }

};

module.exports = TileToWorldY;
