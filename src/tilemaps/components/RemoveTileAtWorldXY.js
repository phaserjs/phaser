/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var RemoveTileAt = require('./RemoveTileAt');
var Vector2 = require('../../math/Vector2');

var point = new Vector2();

/**
 * Removes the tile at the given world coordinates in the specified layer and updates the layer's
 * collision information.
 *
 * @function Phaser.Tilemaps.Components.RemoveTileAtWorldXY
 * @since 3.0.0
 *
 * @param {number} worldX - The x coordinate, in pixels.
 * @param {number} worldY - The y coordinate, in pixels.
 * @param {boolean} replaceWithNull - If true, this will replace the tile at the specified location with null instead of a Tile with an index of -1.
 * @param {boolean} recalculateFaces - `true` if the faces data should be recalculated.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Tilemaps.Tile} The Tile object that was removed.
 */
var RemoveTileAtWorldXY = function (worldX, worldY, replaceWithNull, recalculateFaces, camera, layer)
{
    layer.tilemapLayer.worldToTileXY(worldX, worldY, true, point, camera, layer);

    return RemoveTileAt(point.x, point.y, replaceWithNull, recalculateFaces, layer);
};

module.exports = RemoveTileAtWorldXY;
