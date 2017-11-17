var PutTile = require('./PutTile');
var WorldToTileX = require('./WorldToTileX');
var WorldToTileY = require('./WorldToTileY');

var PutTileWorldXY = function (tile, worldX, worldY, camera, layer)
{
    var tileX = WorldToTileX(worldX, camera, layer);
    var tileY = WorldToTileY(worldY, camera, layer);
    return PutTile(tile, tileX, tileY, layer);
};

module.exports = PutTileWorldXY;
