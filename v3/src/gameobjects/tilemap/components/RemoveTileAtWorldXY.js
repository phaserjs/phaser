var RemoveTileAt = require('./RemoveTileAt');
var WorldToTileX = require('./WorldToTileX');
var WorldToTileY = require('./WorldToTileY');

var RemoveTileAtWorldXY = function (worldX, worldY, replaceWithNull, recalculateFaces, camera, layer)
{
    var tileX = WorldToTileX(worldX, true, camera, layer);
    var tileY = WorldToTileY(worldY, true, camera, layer);
    return RemoveTileAt(tileX, tileY, replaceWithNull, recalculateFaces, layer);
};

module.exports = RemoveTileAtWorldXY;
