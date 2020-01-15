/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var HasTileAt = require('./HasTileAt');
var WorldToTileX = require('./WorldToTileX');
var WorldToTileY = require('./WorldToTileY');

/**
 * Checks if there is a tile at the given location (in world coordinates) in the given layer. Returns
 * false if there is no tile or if the tile at that location has an index of -1.
 *
 * @function Phaser.Tilemaps.Components.HasTileAtWorldXY
 * @private
 * @since 3.0.0
 *
 * @param {number} worldX - The X coordinate of the world position.
 * @param {number} worldY - The Y coordinate of the world position.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when factoring in which tiles to return.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * 
 * @return {?boolean} Returns a boolean, or null if the layer given was invalid.
 */
var HasTileAtWorldXY = function (worldX, worldY, camera, layer)
{
    var tileX = WorldToTileX(worldX, true, camera, layer);
    var tileY = WorldToTileY(worldY, true, camera, layer);

    return HasTileAt(tileX, tileY, layer);
};

module.exports = HasTileAtWorldXY;
