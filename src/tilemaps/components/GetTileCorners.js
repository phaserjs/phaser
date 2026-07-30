/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../math/Vector2');

/**
 * Gets the four corners of a tile, given its tile-space coordinates, as an array of world-space
 * Vector2 positions. The returned positions account for the layer's world position, scale, and
 * the camera's scroll offset, and are ordered: top-left, top-right, bottom-right, bottom-left.
 *
 * @function Phaser.Tilemaps.Components.GetTileCorners
 * @since 3.60.0
 *
 * @param {number} tileX - The x coordinate, in tiles, not pixels.
 * @param {number} tileY - The y coordinate, in tiles, not pixels.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera whose scroll offset is used when calculating the world-space position of the tile corners.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Math.Vector2[]} An array of Vector2s corresponding to the world XY location of each tile corner.
 */
var GetTileCorners = function (tileX, tileY, camera, layer)
{
    var tileWidth = layer.baseTileWidth;
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;

    var worldX = 0;
    var worldY = 0;

    if (tilemapLayer)
    {
        if (!camera) { camera = tilemapLayer.scene.cameras.main; }

        worldX = tilemapLayer.x + camera.scrollX * (1 - tilemapLayer.scrollFactorX);
        worldY = (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));

        tileWidth *= tilemapLayer.scaleX;
        tileHeight *= tilemapLayer.scaleY;
    }

    var x = worldX + tileX * tileWidth;
    var y = worldY + tileY * tileHeight;

    //  Top Left
    //  Top Right
    //  Bottom Right
    //  Bottom Left

    return [
        new Vector2(x, y),
        new Vector2(x + tileWidth, y),
        new Vector2(x + tileWidth, y + tileHeight),
        new Vector2(x, y + tileHeight)
    ];
};

module.exports = GetTileCorners;
