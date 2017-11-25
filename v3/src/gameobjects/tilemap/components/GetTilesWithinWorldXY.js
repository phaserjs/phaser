var GetTilesWithin = require('./GetTilesWithin');
var WorldToTileX = require('./WorldToTileX');
var WorldToTileY = require('./WorldToTileY');

// TODO: add options for filtering by empty, collides, interestingFace
// { isNotEmpty, isColliding, hasInterestingFace }
var GetTilesWithinWorldXY = function (worldX, worldY, width, height, camera, layer)
{
    // Top left corner of the rect, rounded down to include partial tiles
    var xStart = WorldToTileX(worldX, true, camera, layer);
    var yStart = WorldToTileY(worldY, true, camera, layer);

    // Bottom right corner of the rect, rounded up to include partial tiles
    var xEnd = Math.ceil(WorldToTileX(worldX + width, false, camera, layer));
    var yEnd = Math.ceil(WorldToTileY(worldY + height, false, camera, layer));

    return GetTilesWithin(xStart, yStart, xEnd - xStart, yEnd - yStart, layer);
};

module.exports = GetTilesWithinWorldXY;
