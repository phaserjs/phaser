// TODO: add options for filtering by empty, collides, interestingFace
var GetTilesWithin = function (tileX, tileY, width, height, layer)
{
    if (tileX === undefined || tileX < 0) { tileX = 0; }
    if (tileY === undefined || tileY < 0) { tileY = 0; }
    if (width === undefined || tileX + width > layer.width)
    {
        width = Math.max(layer.width - tileX, 0);
    }
    if (height === undefined || tileY + height > layer.height)
    {
        height = Math.max(layer.height - tileY, 0);
    }

    var results = [];

    for (var ty = tileY; ty < tileY + height; ty++)
    {
        for (var tx = tileX; tx < tileX + width; tx++)
        {
            var tile = layer.data[ty][tx];
            if (tile !== null)
            {
                results.push(tile);
            }
        }
    }

    return results;
};

module.exports = GetTilesWithin;
