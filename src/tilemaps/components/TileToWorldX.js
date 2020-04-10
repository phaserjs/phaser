/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../../const.js');

/**
 * Converts from orthogonal tile X coordinates (tile units) to world X coordinates (pixels), factoring in the
 * layer's position, scale and scroll.
 *
 * @function Phaser.Tilemaps.Components.TileToWorldX
 * @private
 * @since 3.0.0
 *
 * @param {integer} tileX - The x coordinate, in tiles, not pixels.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {number}
 */
var OrthoTileToWorldX = function (tileX, camera, layer)
{
    var tileWidth = layer.baseTileWidth;
    var tilemapLayer = layer.tilemapLayer;
    var layerWorldX = 0;

    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }

        layerWorldX = tilemapLayer.x + camera.scrollX * (1 - tilemapLayer.scrollFactorX);

        tileWidth *= tilemapLayer.scaleX;
    }

    return layerWorldX + tileX * tileWidth;

   
};

var nullFunc = function ()
{
    console.warn('With the current map type you have to use the TileToWorldXY function.');
    return null;
};

var TileToWorldX = function (orientation)
{
    switch (orientation)
    {
        case CONST.ORTHOGONAL:
            return OrthoTileToWorldX;
        default:
            return nullFunc;
    }

};

module.exports = TileToWorldX;
