/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../math/Vector2');

/**
 * Converts from hexagonal tile XY coordinates (tile units) to world XY coordinates (pixels), factoring in the
 * layer's position, scale and scroll. This will return a new Vector2 object or update the given
 * `point` object.
 *
 * @function Phaser.Tilemaps.Components.HexagonalTileToWorldXY
 * @since 3.50.0
 *
 * @param {number} tileX - The x coordinate, in tiles, not pixels.
 * @param {number} tileY - The y coordinate, in tiles, not pixels.
 * @param {Phaser.Math.Vector2} point - A Vector2 to store the coordinates in. If not given a new Vector2 is created.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Math.Vector2} The XY location in world coordinates.
 */
var HexagonalTileToWorldXY = function (tileX, tileY, point, camera, layer)
{
    if (!point) { point = new Vector2(); }

    var tileWidth = layer.baseTileWidth;
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;

    var worldX = 0;
    var worldY = 0;

    if (tilemapLayer)
    {
        if (!camera) { camera = tilemapLayer.scene.cameras.main; }

        worldX = tilemapLayer.x + camera.scrollX * (1 - tilemapLayer.scrollFactorX);
        worldY = tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY);

        tileWidth *= tilemapLayer.scaleX;
        tileHeight *= tilemapLayer.scaleY;
    }

    //  Hard-coded orientation values for Pointy-Top Hexagons only

    //  origin
    var tileWidthHalf = tileWidth / 2;
    var tileHeightHalf = tileHeight / 2;

    var x = worldX + (tileWidth * tileX) + tileWidth;
    var y = worldY + ((1.5 * tileY) * tileHeightHalf) + tileHeightHalf;

    if (tileY % 2 === 0)
    {
        x -= tileWidthHalf;
    }

    return point.set(x, y);
};

module.exports = HexagonalTileToWorldXY;
