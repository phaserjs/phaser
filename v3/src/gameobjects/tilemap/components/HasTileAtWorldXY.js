var HasTileAt = require('./HasTileAt');
var WorldToTileX = require('./WorldToTileX');
var WorldToTileY = require('./WorldToTileY');

var HasTileAtWorldXY = function (worldX, worldY, camera, layer)
{
    var tileX = WorldToTileX(worldX, true, camera, layer);
    var tileY = WorldToTileY(worldY, true, camera, layer);

    return HasTileAt(tileX, tileY, layer);
};

module.exports = HasTileAtWorldXY;
