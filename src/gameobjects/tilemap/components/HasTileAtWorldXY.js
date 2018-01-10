var HasTileAt = require('./HasTileAt');
var WorldToTileX = require('./WorldToTileX');
var WorldToTileY = require('./WorldToTileY');

/**
 * Checks if there is a tile at the given location (in world coordinates) in the given layer. Returns
 * false if there is no tile or if the tile at that location has an index of -1.
 *
 * @param {number} worldX - [description]
 * @param {number} worldY - [description]
 * @param {Camera} [camera=main camera] - [description]
 * @param {LayerData} layer - [description]
 * @return {boolean}
 */
var HasTileAtWorldXY = function (worldX, worldY, camera, layer)
{
    var tileX = WorldToTileX(worldX, true, camera, layer);
    var tileY = WorldToTileY(worldY, true, camera, layer);

    return HasTileAt(tileX, tileY, layer);
};

module.exports = HasTileAtWorldXY;
