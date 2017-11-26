var GetTileAt = require('./GetTileAt');
var WorldToTileX = require('./WorldToTileX');
var WorldToTileY = require('./WorldToTileY');

var GetTileAtWorldXY = function (worldX, worldY, nonNull, camera, layer)
{
    var tileX = WorldToTileX(worldX, true, camera, layer);
    var tileY = WorldToTileY(worldY, true, camera, layer);

    return GetTileAt(tileX, tileY, nonNull, layer);
};

module.exports = GetTileAtWorldXY;
