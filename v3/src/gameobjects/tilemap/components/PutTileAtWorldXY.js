var PutTileAt = require('./PutTileAt');
var WorldToTileX = require('./WorldToTileX');
var WorldToTileY = require('./WorldToTileY');

var PutTileAtWorldXY = function (tile, worldX, worldY, recalculateFaces, camera, layer)
{
    var tileX = WorldToTileX(worldX, camera, layer);
    var tileY = WorldToTileY(worldY, camera, layer);
    return PutTileAt(tile, tileX, tileY, layer);
};

module.exports = PutTileAtWorldXY;
