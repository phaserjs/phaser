var PutTileAt = require('./PutTileAt');
var WorldToTileX = require('./WorldToTileX');
var WorldToTileY = require('./WorldToTileY');

/**
 * Puts a tile at the given world coordinates (pixels) in the specified layer. You can pass in either
 * an index or a Tile object. If you pass in a Tile, all attributes will be copied over to the
 * specified location. If you pass in an index, only the index at the specified location will be
 * changed. Collision information will be recalculated at the specified location.
 *
 * @param {integer|Tile} tile - The index of this tile to set or a Tile object.
 * @param {integer} worldX - [description]
 * @param {integer} worldY - [description]
 * @param {boolean} [recalculateFaces=true] - [description]
 * @param {Camera} [camera=main camera] - [description]
 * @param {LayerData} layer - [description]
 * @return {Tile} The Tile object that was created or added to this map.
 */
var PutTileAtWorldXY = function (tile, worldX, worldY, recalculateFaces, camera, layer)
{
    var tileX = WorldToTileX(worldX, true, camera, layer);
    var tileY = WorldToTileY(worldY, true, camera, layer);
    return PutTileAt(tile, tileX, tileY, recalculateFaces, layer);
};

module.exports = PutTileAtWorldXY;
