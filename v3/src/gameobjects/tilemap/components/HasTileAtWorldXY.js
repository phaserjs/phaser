var HasTileAt = require('./HasTileAt');
var WorldToTileX = require('./WorldToTileX');
var WorldToTileY = require('./WorldToTileY');

var HasTileAtWorldXY = function (worldX, worldY, camera, layer)
{
    var tileX = WorldToTileX(worldX, camera, layer);
    var tileY = WorldToTileY(worldY, camera, layer);

    return HasTileAt(tileX, tileY, layer);
};

module.exports = HasTileAtWorldXY;
