/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var PutTileAt = require('./PutTileAt');
var WorldToTileX = require('./WorldToTileX');
var WorldToTileY = require('./WorldToTileY');

/**
 * Puts a tile at the given world coordinates (pixels) in the specified layer. You can pass in either
 * an index or a Tile object. If you pass in a Tile, all attributes will be copied over to the
 * specified location. If you pass in an index, only the index at the specified location will be
 * changed. Collision information will be recalculated at the specified location.
 *
 * @function Phaser.Tilemaps.Components.PutTileAtWorldXY
 * @since 3.0.0
 *
 * @param {integer|Phaser.Tilemaps.Tile} tile - The index of this tile to set or a Tile object.
 * @param {integer} worldX - [description]
 * @param {integer} worldY - [description]
 * @param {boolean} [recalculateFaces=true] - [description]
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * 
 * @return {Phaser.Tilemaps.Tile} The Tile object that was created or added to this map.
 */
var PutTileAtWorldXY = function (tile, worldX, worldY, recalculateFaces, camera, layer)
{
    var tileX = WorldToTileX(worldX, true, camera, layer);
    var tileY = WorldToTileY(worldY, true, camera, layer);
    return PutTileAt(tile, tileX, tileY, recalculateFaces, layer);
};

module.exports = PutTileAtWorldXY;
