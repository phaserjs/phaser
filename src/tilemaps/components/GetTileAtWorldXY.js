/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetTileAt = require('./GetTileAt');
var Vector2 = require('../../math/Vector2');

var point = new Vector2();

/**
 * Gets a tile at the given world coordinates from the given layer.
 *
 * @function Phaser.Tilemaps.Components.GetTileAtWorldXY
 * @since 3.0.0
 *
 * @param {number} worldX - X position to get the tile from (given in pixels)
 * @param {number} worldY - Y position to get the tile from (given in pixels)
 * @param {boolean} nonNull - For empty tiles, return a Tile object with an index of -1 instead of null.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Tilemaps.Tile} The tile at the given coordinates or null if no tile was found or the coordinates were invalid.
 */
var GetTileAtWorldXY = function (worldX, worldY, nonNull, camera, layer)
{
    layer.tilemapLayer.worldToTileXY(worldX, worldY, true, point, camera);

    return GetTileAt(point.x, point.y, nonNull, layer);
};

module.exports = GetTileAtWorldXY;
