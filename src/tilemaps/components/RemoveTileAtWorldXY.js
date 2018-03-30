/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var RemoveTileAt = require('./RemoveTileAt');
var WorldToTileX = require('./WorldToTileX');
var WorldToTileY = require('./WorldToTileY');

/**
 * Removes the tile at the given world coordinates in the specified layer and updates the layer's
 * collision information.
 *
 * @function Phaser.Tilemaps.Components.RemoveTileAtWorldXY
 * @since 3.0.0
 *
 * @param {(integer|Phaser.Tilemaps.Tile)} tile - The index of this tile to set or a Tile object.
 * @param {number} worldX - [description]
 * @param {number} worldY - [description]
 * @param {boolean} [replaceWithNull=true] - If true, this will replace the tile at the specified
 * location with null instead of a Tile with an index of -1.
 * @param {boolean} [recalculateFaces=true] - [description]
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Tilemaps.Tile} The Tile object that was removed.
 */
var RemoveTileAtWorldXY = function (worldX, worldY, replaceWithNull, recalculateFaces, camera, layer)
{
    var tileX = WorldToTileX(worldX, true, camera, layer);
    var tileY = WorldToTileY(worldY, true, camera, layer);
    return RemoveTileAt(tileX, tileY, replaceWithNull, recalculateFaces, layer);
};

module.exports = RemoveTileAtWorldXY;
