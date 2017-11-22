var GetTilesWithin = require('./GetTilesWithin');

// Copies indices, not other properties. Does not modify collisions.
var Copy = function (srcTileX, srcTileY, width, height, destTileX, destTileY, layer)
{
    if (srcTileX === undefined || srcTileX < 0) { srcTileX = 0; }
    if (srcTileY === undefined || srcTileY < 0) { srcTileY = 0; }

    var srcTiles = GetTilesWithin(srcTileX, srcTileY, width, height, layer);

    var offsetX = destTileX - srcTileX;
    var offsetY = destTileY - srcTileY;

    for (var i = 0; i < srcTiles.length; i++)
    {
        var tileX = srcTiles[i].x + offsetX;
        var tileY = srcTiles[i].y + offsetY;
        if (tileX >= 0 && tileX < layer.width && tileY >= 0 && tileY < layer.height)
        {
            layer.data[tileY][tileX].index = srcTiles[i].index;
        }
    }
};

module.exports = Copy;
