var GetTileAt = require('./GetTileAt');
var WorldToTileX = require('./WorldToTileX');
var WorldToTileY = require('./WorldToTileY');

/**
 * Gets a tile at the given world coordinates from the given layer.
 *
 * @param {number} worldX - X position to get the tile from (given in pixels)
 * @param {number} worldY - Y position to get the tile from (given in pixels)
 * @param {boolean} [nonNull=false] - If true, function won't return null for empty tiles, but a Tile
 * object with an index of -1.
 * @param {Camera} [camera=main camera] - [description]
 * @param {LayerData} layer - [description]
 * @return {Tile} The tile at the given coordinates or null if no tile was found or the coordinates
 * were invalid.
 */
var GetTileAtWorldXY = function (worldX, worldY, nonNull, camera, layer)
{
    var tileX = WorldToTileX(worldX, true, camera, layer);
    var tileY = WorldToTileY(worldY, true, camera, layer);

    return GetTileAt(tileX, tileY, nonNull, layer);
};

module.exports = GetTileAtWorldXY;
