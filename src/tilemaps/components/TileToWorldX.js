/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Converts from tile X coordinates (tile units) to world X coordinates (pixels), factoring in the
 * layer's position, scale and scroll.
 *
 * @function Phaser.Tilemaps.Components.TileToWorldX
 * @since 3.0.0
 *
 * @param {number} tileX - The x coordinate, in tiles, not pixels.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use when calculating the world position from the tile coordinates.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {number} The world X coordinate, in pixels, corresponding to the given tile X coordinate.
 */
var TileToWorldX = function (tileX, camera, layer)
{
    var tileWidth = layer.baseTileWidth;
    var tilemapLayer = layer.tilemapLayer;
    var layerWorldX = 0;

    if (tilemapLayer)
    {
        if (!camera) { camera = tilemapLayer.scene.cameras.main; }

        layerWorldX = tilemapLayer.x + camera.scrollX * (1 - tilemapLayer.scrollFactorX);

        tileWidth *= tilemapLayer.scaleX;
    }

    return layerWorldX + tileX * tileWidth;
};

module.exports = TileToWorldX;
