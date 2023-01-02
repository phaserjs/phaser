/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var HasTileAt = require('./HasTileAt');
var Vector2 = require('../../math/Vector2');

var point = new Vector2();

/**
 * Checks if there is a tile at the given location (in world coordinates) in the given layer. Returns
 * false if there is no tile or if the tile at that location has an index of -1.
 *
 * @function Phaser.Tilemaps.Components.HasTileAtWorldXY
 * @since 3.0.0
 *
 * @param {number} worldX - The X coordinate of the world position.
 * @param {number} worldY - The Y coordinate of the world position.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use when factoring in which tiles to return.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {?boolean} Returns a boolean, or null if the layer given was invalid.
 */
var HasTileAtWorldXY = function (worldX, worldY, camera, layer)
{
    layer.tilemapLayer.worldToTileXY(worldX, worldY, true, point, camera);

    var tileX = point.x;
    var tileY = point.y;

    return HasTileAt(tileX, tileY, layer);
};

module.exports = HasTileAtWorldXY;
