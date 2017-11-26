var PutTileAt = require('./PutTileAt');
var WorldToTileX = require('./WorldToTileX');
var WorldToTileY = require('./WorldToTileY');

var PutTileAtWorldXY = function (tile, worldX, worldY, recalculateFaces, camera, layer)
{
    var tileX = WorldToTileX(worldX, true, camera, layer);
    var tileY = WorldToTileY(worldY, true, camera, layer);
    return PutTileAt(tile, tileX, tileY, recalculateFaces, layer);
};

module.exports = PutTileAtWorldXY;
