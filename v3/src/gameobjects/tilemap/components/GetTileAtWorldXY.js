var GetTileAt = require('./GetTileAt');
var SnapFloor = require('../../../math/snap/SnapFloor');

// NOTE: phaser v2 version doesn't account for TilemapLayer's XY, so neither does this version
// currently.

var GetTileAtWorldXY = function (worldX, worldY, nonNull, layer)
{
    var tileX = SnapFloor(worldX, layer.tileWidth) / layer.tileWidth;
    var tileY = SnapFloor(worldY, layer.tileHeight) / layer.tileHeight;

    return GetTileAt(tileX, tileY, nonNull, layer);
};

module.exports = GetTileAtWorldXY;
