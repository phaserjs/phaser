/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../math/Vector2');

/**
 * Gets the corners of the Tile as an array of Vector2s.
 *
 * @function Phaser.Tilemaps.Components.GetTileCorners
 * @since 3.60.0
 *
 * @param {number} tileX - The x coordinate, in tiles, not pixels.
 * @param {number} tileY - The y coordinate, in tiles, not pixels.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use when calculating the tile index from the world values.
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
