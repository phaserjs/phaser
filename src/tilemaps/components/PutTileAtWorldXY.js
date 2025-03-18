/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PutTileAt = require('./PutTileAt');
var Vector2 = require('../../math/Vector2');

var point = new Vector2();

/**
 * Puts a tile at the given world coordinates (pixels) in the specified layer. You can pass in either
 * an index or a Tile object. If you pass in a Tile, all attributes will be copied over to the
 * specified location. If you pass in an index, only the index at the specified location will be
 * changed. Collision information will be recalculated at the specified location.
 *
 * @function Phaser.Tilemaps.Components.PutTileAtWorldXY
 * @since 3.0.0
 *
 * @param {(number|Phaser.Tilemaps.Tile)} tile - The index of this tile to set or a Tile object.
 * @param {number} worldX - The x coordinate, in pixels.
 * @param {number} worldY - The y coordinate, in pixels.
 * @param {boolean} recalculateFaces - `true` if the faces data should be recalculated.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Tilemaps.Tile} The Tile object that was created or added to this map.
 */
var PutTileAtWorldXY = function (tile, worldX, worldY, recalculateFaces, camera, layer)
{
    layer.tilemapLayer.worldToTileXY(worldX, worldY, true, point, camera, layer);

    return PutTileAt(tile, point.x, point.y, recalculateFaces, layer);
};

module.exports = PutTileAtWorldXY;
