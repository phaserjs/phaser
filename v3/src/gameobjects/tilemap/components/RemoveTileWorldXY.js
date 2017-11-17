var RemoveTile = require('./RemoveTile');
var WorldToTileX = require('./WorldToTileX');
var WorldToTileY = require('./WorldToTileY');

var RemoveTileWorldXY = function (worldX, worldY, replaceWithNull, camera, layer)
{
    var tileX = WorldToTileX(worldX, camera, layer);
    var tileY = WorldToTileY(worldY, camera, layer);
    return RemoveTile(tileX, tileY, replaceWithNull, layer);
};

module.exports = RemoveTileWorldXY;
